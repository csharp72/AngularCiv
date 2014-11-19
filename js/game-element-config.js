//Configuration file for game elements

angular.module('geConfig', [])
	
	.factory('geConfig', 
	['buildings','resources','jobs','population','upgrades',
	function(buildings, resources,  jobs, population, upgrades){

//------Resources 

		var food 			= resources.add('Food');
		var wood 			= resources.add('Wood');
		var stone 			= resources.add('Stone');
		var skins 			= resources.add('Skins');
		var herbs 			= resources.add('Herbs');
		var ore 			= resources.add('Ore');
		var leather 		= resources.add('Leather');
		var medicine 		= resources.add('Medicine');
		var metal 			= resources.add('Metal');

//------Buildings

		var tent 			= buildings.add("Tent");
		var hut 			= buildings.add("Hut");
		var foodStorage 	= buildings.add("Food Storage");
		var woodStorage 	= buildings.add("Wood Storage");
		var stoneStorage 	= buildings.add("Stone Storage");

//------Jobs

		var unemployed 		= jobs.add('Unemployed');
		var farmer 			= jobs.add('Farmer');
		var hunter 			= jobs.add('Hunter');
		var rancher 		= jobs.add('Rancher');
		var woodcutter 		= jobs.add('Wood Cutter');
		var miner 			= jobs.add('Miner');

//------Upgrades

		var skinning 		= upgrades.add("Skinning", "Gatherers can produce skins");
		var Harvesting 		= upgrades.add("Harvesting", "Wood Cutters can produce herbs");
		var prospecting 	= upgrades.add("Prospecting", "Miners can produce ore");
		var masonry 		= upgrades.add("Masonry", "Unlock more buildings and upgrades");


//------Resource Options

		food.options({
			max: 200,
		});
		wood.options({
			max: 200,
		});
		stone.options({
			max: 200,
		});

//------Buildings Options
	
		//TODO 
		//use tuples instead of key value pairs for perks
		//decide on how to structure cost

		tent.options({
			cost:{
				wood:2,
				skins:2,
			},
			perks:[
				[population.max, 1],
			],
		});
		hut.options({
			cost:{ 
				wood:20,
				skins:1,
			},
			perks:[ 		
				[population.max, 3],
			],
		});
		foodStorage.options({
			cost:{
				wood:100,
			},
			perks:[
				[food.max, 200],
			],
		});
		woodStorage.options({
			cost:{
				wood:100,
			},
			perks:[
				[wood.max, 200],
			],
		});
		stoneStorage.options({
			cost:{
				wood:100,
			},
			perks:[
				[stone.max, 200],
			],
		});

//------Job Options

		unemployed.options({ 
			cost:{food:20} 
		});
		farmer.options({ 
			production:{food:1.2} 
		});
		hunter.options({ 
			cost:{wood:1,stone:1}, 
			production:{food:3} 
		});
		rancher.options({ 
			cost:{wood:100,metal:100,food:300}, 
			production:{food:8} 
		});
		woodcutter.options({ 
			production:{wood:1} 
		});
		miner.options({ 
			production:{stone:1} 
		});

//------Upgrade Options

		skinning.options({
			cost: {skins:10},
			perks: [
				[food.produceSpecialChance, .1],
			]
		});
		harvesting.options({
			cost: {herbs:10},
			perks: [
				[wood.produceSpecialChance, .1],
			]
		});
		prospecting.options({
			cost: {ore:10},
			perks: [
				[stone.produceSpecialChance, .1],
			]
		});
		masonry.options({
			cost: {wood:100, stone:100}
		});
		
	}
])