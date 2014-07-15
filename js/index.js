
angular.module('app', ['ngTouch','ngCookies','game','resources','population','buildings','filters']);

angular.module('app').controller('GameCtrl', 
	
	['$scope','$interval','$timeout','$cookieStore','game','buildings','resources','jobs','population',
	function($scope, $interval, $timeout, $cookieStore, game, buildings, resources,  jobs, population){

		window.scope = window.$scope = $scope;

		$scope.resources = resources;
		$scope.buildings = buildings;
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

		$scope.canMakeWorker = game.canMakeWorker;
		$scope.canAssignWorker = game.canAssignWorker;
		$scope.buildBuilding = game.buildBuilding;

		var flyUpAnim = 1;
		$scope.collect = function( resource, $event ){
			$event.stopPropagation();

			var collectedResource = resource.collect();
			if( collectedResource ){
				// var snd = new Audio("./sound/collect.mp3")
				// snd.play(0);

				var $res = $($event.target).closest('.resource');
				var $gr = $res.data('gatheredResource').clone();
				$res.find('.gathered-resources').append( $gr );
				$gr.find('img').addClass( 'flyUp' + flyUpAnim );
				flyUpAnim = flyUpAnim == 1 ? 2 : 1;
				setTimeout(function(){
					$gr.remove();
					delete $gr;
				}, 1000)

				if( collectedResource[1] ){
					var $spR = $res.find('.special-resource-image').clone();
					$spR.appendTo( $res.find('.special-resource') ).css({opacity:0, position:'absolute', marginLeft: '-15px'}).addClass('flyUp1');
					setTimeout(function(){
						$spR.remove();
						delete $spR;
					}, 1000)
				}
			}
		}

		$scope.workingJobs = [
			jobs.gatherer,
			jobs.woodcutter,
			jobs.miner,
		]

		$scope.buildingsList = [];
		angular.forEach(buildings,function(b){
			$scope.buildingsList[b.id] = b;
		})

		var gameLoop = $interval(function(){
			resources.produce();
		}, 1000);

		$(document).ready(function(){
			// $('button').on('click', function(){
			// 	var snd = new Audio("./sound/collect.mp3")
			// 	snd.play(0);
			// })

			$('.resources .resource').each(function(){
				$(this).data('gatheredResource', $(this).find('.gathered-resource').detach() );
			})
		})

		function simplify( obj ){
			var newObj = {};
			angular.forEach(obj, function(att, key){
				if( typeof att == 'object' ){
					newObj[key] = simplify(att);
				}else if( typeof att != 'function'){
					newObj[key] = att;
				}
			})
			return newObj;
		}
		
	}
])