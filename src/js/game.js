angular.module('game', [])
	
	.factory('game', 
	['$rootScope','$cookieStore','$firebase','$timeout','buildings','resources','jobs','population','upgrades','prompt', 'confirm',
	function($rootScope, $cookieStore, $firebase, $timeout, buildings, resources,  jobs, population, upgrades, prompt, confirm){
		var game = {};

		// game.savedGames = $firebase(new Firebase("https://angularciv.firebaseio.com/savedGames")).$asArray();
		// game.savedGames.$loaded(function(){
		// 	console.log( game.savedGames, game.savedGames.$$getKey(game.savedGames[0]) )
		// 	if( !game.savedGames.length ){
		// 		$timeout(function(){
		// 			prompt('Name your brand new village.').then(function(villageName){
		// 				var newGame = {name: villageName};
		// 				var ref = game.savedGames.$add( newGame );
		// 				game.currentGame = game.savedGames[ game.savedGames.length - 1 ];
		// 			});
		// 		}, 100);
		// 	}else{
		// 		game.currentGame = game.savedGames[0];
		// 		game.load();
		// 	}
		// })


		// game.savedGames.$add({Foo: "Bar"});

		game.save = function(){
			// $cookieStore.put('ngCiv_resources' + game.currentGame, 	justTotals(resources) 	);
			// $cookieStore.put('ngCiv_buildings' + game.currentGame, 	justTotals(buildings) 	);
			// $cookieStore.put('ngCiv_jobs' + game.currentGame, 		justTotals(jobs) 		);
			// $cookieStore.put('ngCiv_upgrades' + game.currentGame, 	justTotals(upgrades) 	);

			function justTotals( collection ){
				var newObj = {};
				angular.forEach( collection, function(colObj, key){
					if( typeof colObj.total != 'undefined' ){
						newObj[key] = {total: colObj.total}
					}
				})
				return newObj;
			}
		}

		game.load = function(){

			// loadTotals( resources, 	$cookieStore.get('ngCiv_resources' + game.currentGame) 		);
			// loadTotals( buildings, 	$cookieStore.get('ngCiv_buildings' + game.currentGame) 		);
			// loadTotals( jobs, 		$cookieStore.get('ngCiv_jobs' + game.currentGame) 			);
			// loadTotals( upgrades, 	$cookieStore.get('ngCiv_upgrades' + game.currentGame) 		);

			function loadTotals( collection, loadData ){
				angular.forEach( loadData, function(loadItem, key){
					if( typeof loadItem.total != 'undefined' ){
						collection[key].total = loadItem.total;
					}
				})
			}
		}

		game.deleteSave = function( savedGame ){
			confirm('Delete ' +  savedGame.name + "?").then(function(){
				game.savedGames.$remove(savedGame)
			});
		}

		game.switch = function( savedGame ){

			if( savedGame ){
				switchGame( savedGame );
			}else{
				var lastGame = game.currentGame;
				game.currentGame = "";
				game.resetToZero();
				prompt('Name your brand new village').then(
					function(gameName){
						switchGame( gameName );
					},
					function(){
						game.currentGame = lastGame;
					}
				);
			}

			function switchGame( savedGame ){
				game.currentGame = savedGame;
				game.resetToZero();
				game.load();
			}

		}

		game.resetToZero = function(){
			resetToZero(resources);
			resetToZero(buildings);
			resetToZero(jobs);
			resetToZero(upgrades);

			function resetToZero(collection){
				angular.forEach(collection, function(colObj){
					if( typeof colObj.total != 'undefined' ){
						colObj.total = 0;
					}
				})
			}			
		}


		
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
				//are requirements met?
				var reqMet = true;
				angular.forEach( upgrade.requirements, function(req){
					if( upgrades[req].total == 0 ){
						reqMet = false;
					}
				});
				upgrade.requirementsMet = reqMet;

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