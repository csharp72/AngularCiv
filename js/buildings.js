(function(){

	angular.module('buildings', [])

		.factory('buildings', function(){

			var currId = 0;
			function nextId(){
				return currId++;
			}

			function Building(name, cost, boons, requirements){
				this.id = nextId();
				this.name = name;
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
				tent: 			new Building("Tent", 			{wood:2,skins:2}, 		{population:{max:1}}		),
				hut:			new Building("Hut", 			{wood:20,skins:1}, 		{population:{max:3}}		),
				foodStorage: 	new Building("Food Storage", 	{wood: 100}, 			{food: {max:200}}			),
				woodStorage: 	new Building("Wood Storage", 	{wood: 100}, 			{wood: {max:200}}			),
				stoneStorage: 	new Building("Stone Storage", 	{wood: 100}, 			{stone: {max:200}}			),
			});

			Buildings.prototype.build = function( building, amount ){
				var amount = amount || 1;
				building.build(amount);
			}

			return buildings;
		})

})();