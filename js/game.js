
angular.module('app', ['resources','population','buildings','filters']);

angular.module('app').controller('GameCtrl', 
	
	['$scope','buildings','resources','$interval','jobs','population',
	function($scope, buildings, resources, $interval, jobs, population){

		window.scope = window.$scope = $scope;

		$scope.resources = resources;
		$scope.buildings = buildings;
		$scope.workers = population.workers;
		$scope.jobs = jobs;
		$scope.population = population;

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

		$scope.collect = function( resource ){
			if( resource.collect() ){
				// var snd = new Audio("./sound/collect.mp3")
				// snd.play(0);
			}
		}

		$scope.workingJobs = [
			jobs.gatherer,
			jobs.hunter,
			jobs.farmer,
			jobs.rancher,
			jobs.woodcutter,
			jobs.miner,
		]

		var gameLoop = $interval(function(){
			//console.log('tick');
			//population.setProductionRates();
			resources.produce();
		}, 1000);

		// $(document).ready(function(){
		// 	$('button').on('click', function(){
		// 		var snd = new Audio("./sound/collect.mp3")
		// 		snd.play(0);
		// 	})
		// })
		
	}
])