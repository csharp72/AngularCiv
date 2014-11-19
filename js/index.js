
angular.module('app', ['ngTouch','ngCookies','ngAnimate','game','resources','population','jobs','buildings','upgrades','filters','alertPromptConfirm']);

angular.module('app').controller('GameCtrl', 
	
	['$scope','$interval','$timeout','$cookieStore','game','buildings','resources','jobs','population','upgrades',
	function($scope, $interval, $timeout, $cookieStore, game, buildings, resources,  jobs, population, upgrades){

		window.scope = window.$scope = $scope;

		$scope.game = game;
		$scope.resources = resources;
		$scope.buildings = buildings;
		$scope.jobs = jobs;
		$scope.population = population;
		$scope.upgrades = upgrades;

		$scope.screens = {
			game: "Game",
			resources: "Gather",
			buildings: "Build",
			population: "Populate",
			upgrades: "Upgrade",
		}
		$scope.selectedScreen = $scope.screens.resources;
		$scope.selectScreen = function( screen ){
			$scope.lastScreen = $scope.selectedScreen;
			$scope.selectedScreen = screen;
		}
		$scope.screensList = [
			$scope.screens.game,
			$scope.screens.resources,
			$scope.screens.buildings,
			$scope.screens.population,
			$scope.screens.upgrades,
		]

		$scope.chooseGame = false;

		$scope.canMakeWorker = game.canMakeWorker;
		$scope.canAssignWorker = game.canAssignWorker;
		$scope.buildBuilding = game.buildBuilding;
		$scope.buyUpgrade = game.buyUpgrade;

		var flyUpAnim = 1;
		$scope.collect = function( resource, $event ){
			$event.stopPropagation();

			var collectedResource = resource.collect();
			if( collectedResource ){
				// var snd = new Audio("./sound/collect.mp3")
				// snd.play(0);

				var $res = $($event.target).closest('.resource');
				var $gr = $res.find('.gathered-resource').first().clone();
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
			jobs.farmer,
			jobs.woodcutter,
			jobs.miner,
		]

		$scope.buildingsList = [];
		angular.forEach(buildings,function(b){
			$scope.buildingsList[b.id] = b;
		})

		var gameLoop = $interval(function(){
			resources.produce();
			game.save();

		}, 1000);

		$(document).ready(function(){
			// $('button').on('click', function(){
			// 	var snd = new Audio("./sound/collect.mp3")
			// 	snd.play(0);
			// })
		})

		$scope.round = function(num){
			return Math.round( num ) || 0;
		}
		
		$scope.isEmptyObject = function( obj ){
			return jQuery.isEmptyObject( obj );
		}

		$scope.selectScreen = function( screen ){
			$scope.lastScreen = $scope.selectedScreen;
			$scope.selectedScreen = screen;
		}

		$scope.previousScreen = function(){
			
			var i = $scope.screensList.indexOf( $scope.selectedScreen ) - 1;
			var previousScreen = i < 0 ? $scope.screensList[$scope.screensList.length -1] : $scope.screensList[i];
			
			$scope.selectScreen( previousScreen );
		}

		$scope.nextScreen = function(){

			var i = $scope.screensList.indexOf( $scope.selectedScreen ) + 1;
			var nextScreen = i >= $scope.screensList.length ? $scope.screensList[0] : $scope.screensList[i];
			
			$scope.selectScreen( nextScreen );
		}
	}
])