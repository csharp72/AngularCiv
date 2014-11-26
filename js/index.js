(function(){
	var app = angular.module('app', ['ngTouch','ngCookies','ngAnimate','firebase','game','resources','population','jobs','buildings','upgrades','filters','alertPromptConfirm','foos','gameElements']);
	
	app.controller('GameCtrl',
		['foos', '$scope','$interval','$timeout','$cookies','$firebase','$firebaseAuth','SavedGame','game','buildings','resources','jobs','population','upgrades','prompt',
		function(foos, $scope, $interval, $timeout, $cookies, $firebase, $firebaseAuth, SavedGame, game, buildings, resources,  jobs, population, upgrades, prompt){

			window.scope = window.$scope = $scope;

			// $scope.game = game;
			$scope.game = {};
			$scope.resources = resources;
			$scope.buildings = buildings;
			$scope.jobs = jobs;
			$scope.population = population;
			$scope.upgrades = upgrades;
			$scope.foos = foos;

			$scope.auth = $firebaseAuth(new Firebase("https://angularciv.firebaseio.com/"));

			$scope.login = function(login){
				$scope.auth.$authWithPassword({
					email: login.email, 
					password: login.password
				}).catch(authFail);
			}

			function authFail(error){
				$scope.loginShown = true;
				console.error("Authentication failed:", error);
			}

			$scope.logout = function(){
				$scope.auth.$unauth();
				$scope.loginShown = true;
			}

			$scope.skipLogin = function(){
				$scope.auth.$authAnonymously().catch(authFail);
			}

			$scope.auth.$onAuth(function(authData){
				if (authData) {
					console.log('logged in', authData)
					$scope.currentUser = authData;

					//retrieve saved games
					$scope.savedGame = SavedGame(authData.uid)
					$scope.savedGame.$bindTo($scope, "game").then(function(){
						if( $scope.savedGame.$value === null ){
							$timeout(function(){
								prompt('Name your brand new village.').then(function(villageName){
									$scope.game = {name:villageName};
								});
							});
						}
					})
					
				} else {
					//logged out
					$scope.savedGame && $scope.savedGame.$destroy();
					$scope.game = {};
					game.resetToZero();
					$scope.currentUser = '';
				}
			});

			$scope.$watch('game', function(val){
				console.log("data changed!", val );

				loadTotals(resources, $scope.game.resources);
				loadTotals(buildings, $scope.game.buildings);
				loadTotals(jobs, $scope.game.jobs);
				loadTotals(population, $scope.game.population);
				loadTotals(upgrades, $scope.game.upgrades);
			})

			$scope.$watch('resources', function(val){
				$scope.game.resources = justTotals(val);
			},true);

			$scope.$watch('buildings', function(val){
				$scope.game.buildings = justTotals(val);
			},true);

			$scope.$watch('jobs', function(val){
				$scope.game.jobs = justTotals(val);
			},true);

			$scope.$watch('population', function(val){
				$scope.game.population = justTotals(val);
			},true);

			$scope.$watch('upgrades', function(val){
				$scope.game.upgrades = justTotals(val);
			},true);

			function loadTotals( collection, loadData ){
				if( loadData ){
					angular.forEach( loadData, function(loadItem, key){
						if( typeof loadItem.total != 'undefined' ){
							collection[key].total = loadItem.total;
						}
					})
				}
			}

			function justTotals( collection ){
				var newObj = {};
				angular.forEach( collection, function(colObj, key){
					if( typeof colObj.total != 'undefined' ){
						newObj[key] = {total: colObj.total}
					}
				})
				return newObj;
			}

			// $scope.signup = function(){
			// 	console.log('signup', $scope.signup.email, $scope.signup.password)
			// 	$scope.auth.$createUser({
			// 		email: $scope.signup.email,
			// 		password: $scope.signup.password
			// 	}).then(function(data) {
			// 		console.log("User created successfully!", data);
			// 		return $scope.auth.$authWithPassword({
			// 			email: $scope.signup.email,
			// 			password: $scope.signup.password
			// 		});
			// 	}).catch(authFail);
			// }

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

	app.factory("SavedGames", ["$firebase", function($firebase){
		return function(user){
			return $firebase(new Firebase("https://angularciv.firebaseio.com/savedGames/").child(user)).$asArray();
		}
	}]);

	app.factory("SavedGame", ["$firebase", function($firebase){
		return function(user){
			return $firebase(new Firebase("https://angularciv.firebaseio.com/savedGames/").child(user)).$asObject();
		}
	}]);
}())

