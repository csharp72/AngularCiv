angular.module('game', [])
	
	.factory('game', 
	['$rootScope','buildings','resources','jobs','population',
	function($rootScope, buildings, resources,  jobs, population){

		var game = {};

		game.canMakeWorker = function( amount ){
			var amount = amount || 1;
			return resources.enough( jobs.unemployed.cost, amount ) && population.total + amount <= population.max;
		}

		game.canAssignWorker = function( job, amount ){
			var amount = amount || 1;
			var cnd1 = population.getJobTotal(jobs.unemployed) >= amount;
			var cnd2 = resources.enough( job.cost, amount );
			return cnd1 && cnd2;
		}

		game.buildBuilding = function( building, amount ){
			var amount = amount || 1;
			if( resources.use(building.cost, amount) ){
				building.build(amount);
			}
		}

		$rootScope.$watch( function(){
			return buildings;
		}, function(){
			calcResourceMax();
			calcPopMax();
		}, true);

		$rootScope.$watch(function(){ 
			return population.workers 
		}, function(){ 
			calcPopTotal(); 
			calcProdRates();
		}, true);

		function calcResourceMax(){
			angular.forEach( resources, function(resource){
				resource.max = resource.baseMax;

				angular.forEach(buildings, function(building){
					angular.forEach(building.boons, function(boon, boonKey){
						if( resources[boonKey] == resource ){
							angular.forEach( boon, function(amount, attr){
								resource[attr] += amount * building.total;
							})
						}
					})
				})
			})
		}

		function calcPopMax(){
			population.max = 0;
			angular.forEach( buildings, function(building){
				if( building.boons.population && building.boons.population.max ){
					population.max += building.boons.population.max * building.total;
				}
			})
		}

		function calcPopTotal(){
			population.total = population.workers.length;
		}

		function calcProdRates(){
			angular.forEach(resources, function(resource){
				resource.productionRate = 0;
			})
			angular.forEach(population.workers, function(worker){
				if( !worker.sick && !worker.dead ){
					angular.forEach( worker.job.production, function(amount, product){
						resources[product].productionRate += amount;
					})
				}
			})
			resources.food.productionRate -= population.total;
		}

		return game;
		
	}
])