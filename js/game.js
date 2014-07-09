
angular.module('app', ['resources','population','buildings']);

angular.module('app').controller('GameCtrl', 
	
	['$scope','buildings','resources','$interval','jobs','population',
	function($scope, buildings, resources, $interval, jobs, population){

		window.scope = $scope;

		//console.log( 'buildings', buildings.makeNew() )

		$scope.resources = resources;
		$scope.buildings = buildings;
		$scope.workers = population.workers;
		$scope.jobs = jobs;
		$scope.population = population;



		function setProductionRates(){
			angular.forEach(resources, function(resource){
				resource.productionRate = 0;
			})
			angular.forEach(population.workers, function(worker){
				if( !worker.sick ){
					angular.forEach( worker.job.production, function(amount, product){
						resources[product].productionRate += amount;
					})
				}
			})

			resources.food.productionRate -= population.total;
		}

		$scope.canMakeWorker = function( amount ){
			var amount = amount || 1;
			return resources.enough( jobs.unemployed.cost, amount ) && population.total + amount <= population.max;
		}

		$scope.canAssignWorker = function( job, amount ){
			var amount = amount || 1;
			var cnd1 = population.getJobTotal(jobs.unemployed) >= amount;
			var cnd2 = resources.enough( job.cost, amount );
			return cnd1 && cnd2;
		}

		$scope.workingJobs = [
			jobs.gatherer,
			jobs.hunter,
			jobs.farmer,
			jobs.rancher,
			jobs.woodcutter,
			jobs.miner,
		]

		console.log( $scope.workingJobs )

		var gameLoop = $interval(function(){
			console.log('tick');
			setProductionRates();
			resources.produce();
		}, 1000);
	}
])