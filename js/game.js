
angular.module('app', ['resources','population','buildings','filters']);

angular.module('app').controller('GameCtrl', 
	
	['$scope','buildings','resources','$interval','$timeout','jobs','population',
	function($scope, buildings, resources, $interval, $timeout, jobs, population){

		window.scope = window.$scope = $scope;

		$scope.resources = resources;
		$scope.buildings = buildings;
		$scope.workers = population.workers;
		$scope.jobs = jobs;
		$scope.population = population;

		$scope.screens = {
			resources: 0,
			buildings: 1,
			population: 2,
		}
		$scope.selectedScreen = $scope.screens.resources;
		$scope.selectScreen = function( screen ){
			$scope.selectedScreen = screen;
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

		$scope.collect = function( resource, $event ){
			if( resource.collect() ){
				// var snd = new Audio("./sound/collect.mp3")
				// snd.play(0);

				var $res = $($event.target).closest('.resource');
				var $gr = $res.data('gatheredResource').clone();
				$res.find('.gathered-resources').append( $gr );
				setTimeout(function(){
					$gr.remove();
					delete $gr;
				}, 1000)
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

		$(document).ready(function(){
			// $('button').on('click', function(){
			// 	var snd = new Audio("./sound/collect.mp3")
			// 	snd.play(0);
			// })

			$('.resources .resource').each(function(){
				$(this).data('gatheredResource', $(this).find('.gathered-resource').detach() );
				console.log( $(this), $(this).data('gatheredResource') )
			})
		})
		
	}
])