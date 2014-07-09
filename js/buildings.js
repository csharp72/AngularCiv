(function(){

	angular.module('buildings', ['resources', 'population'])

		.factory('buildings', function(resources, population){

			function Building(name, cost, boons, requirements){
				this.name = name;
				this.cost = cost || {};
				this.boons = boons || {};
				this.requirements = requirements || {};
				this.total = 0;
				this.devotion = 0;
			}

			function Buildings(buildings){
				angular.extend(this, buildings);
			}

			var buildings = new Buildings({
				tent: new Building("Tent", {wood:2,skins:2}, {maxPopulation:1}),
				woodHut: new Building("Wood Hut", {wood:20,skins:1}, {maxPopulation:3}),
			});

			Buildings.prototype.build = function( building, amount ){
				if( resources.use(building.cost) ){
					building.total++;
					population.max += building.boons.maxPopulation;
				}
			}

			return buildings;
		})

})();