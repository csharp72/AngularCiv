(function(){

	angular.module('buildings', [])

		.factory('buildings', function(){

			var currId = 0;
			function nextId(){
				return currId++;
			}

			function Building(name, type, cost, boons, requirements){
				this.id = nextId();
				this.name = name;
				this.type = type;
				this.cost = cost || {};
				this.boons = boons || {};
				this.requirements = requirements || {};
				this.total = 0;
				this.devotion = 0;
			}

			Building.prototype.build = function(amount){
				var amount = amount || 1;
				this.total += amount;
			}

			function Buildings(buildings){
				angular.extend(this, buildings);
			}

			var buildings = new Buildings({
				tent: 			new Building("Tent", 			"housing",	{wood:2,skins:2}, 		{population:{max:1}}		),
				hut:			new Building("Hut", 			"housing",	{wood:20,skins:1}, 		{population:{max:3}}		),
				
				foodStorage: 	new Building("Food Storage", 	"storage",	{wood: 100}, 			{food: {max:200}}			),
				woodStorage: 	new Building("Wood Storage", 	"storage",	{wood: 100}, 			{wood: {max:200}}			),
				stoneStorage: 	new Building("Stone Storage", 	"storage",	{wood: 100}, 			{stone: {max:200}}			),
			});

			Buildings.prototype.build = function( building, amount ){
				var amount = amount || 1;
				building.build(amount);
			}

			return buildings;
		})

})();