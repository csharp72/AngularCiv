angular.module('game', [])
	
	.factory('game', 
	['$rootScope','buildings','resources','jobs','population','upgrades',
	function($rootScope, buildings, resources,  jobs, population, upgrades){

		var game = {};

		game.canMakeWorker = function( amount ){
			var amount = amount || 1;
			return resources.enough( jobs.unemployed.cost, amount ) && population.total + amount <= population.max;
		}

		game.canAssignWorker = function( job, amount ){
			var amount = amount || 1;
			var cnd1 = jobs.unemployed.total >= amount;
			var cnd2 = resources.enough( job.cost, amount );
			return cnd1 && cnd2;
		}

		game.buildBuilding = function( building, amount ){
			var amount = amount || 1;
			if( resources.use(building.cost, amount) ){
				building.build(amount);
			}
		}

		game.buyUpgrade = function( upgrade, amount ){
			var amount = amount || 1;
			console.log( upgrade.cost )
			if( resources.use(upgrade.cost, amount) ){
				upgrade.aquire(amount);
			}
		}

		$rootScope.$watch( function(){
			return buildings;
		}, function(){
			calcResourceMax();
			calcPopMax();
		}, true);

		$rootScope.$watch(function(){ 
			return jobs;
		}, function(){ 
			calcPopTotal(); 
			calcResourceRates();
		}, true);

		$rootScope.$watch(function(){ 
			return upgrades;
		}, function(){ 
			calcUpgrades();
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

		function calcResourceRates(){
			angular.forEach(resources, function(resource){
				resource.productionRate = 0;
				resource.consumptionRate = 0;
				resource.grossRate = 0;
			})

			angular.forEach(jobs, function(job){
				angular.forEach( job.production, function(amount, product){
					resources[product].productionRate += amount * (job.total - job.sick);
					resources[product].grossRate += amount * (job.total - job.sick);
				})
			})

			resources.food.consumptionRate += population.total;
			resources.food.grossRate = resources.food.productionRate - resources.food.consumptionRate;
		}

		function calcUpgrades(){
			angular.forEach(upgrades, function(upgrade){
				angular.forEach( upgrade.benefits, function(benefit, benefitName){
					var benefitEffect = benefit[1]
					angular.forEach( benefitEffect, function(ben, key){
						
						var res = resources[key];
						if( res ){
							angular.forEach(ben, function(att, key){
								res[key] += att * upgrade.total;
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
			population.total = 0;
			angular.forEach( jobs, function(job){
				population.total += job.total;
			})
		}

		return game;
		
	}
])