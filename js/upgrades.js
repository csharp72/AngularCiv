(function(){

	angular.module('upgrades', [])

		.factory('upgrades', function(){

			var currId = 0;
			function nextId(){
				return currId++;
			}

			var list = [];

			function Upgrade(name, cost, benefits, requirements){
				this.id = nextId();
				this.name = name;
				this.total = 0;
				this.got = false;
				this.cost = cost || {};
				this.benefits = benefits || {};
				this.requirements = requirements || {};

				list.push( this );
			}

			Upgrade.prototype.aquire = function(amount){
				var amount = amount || 1;
				this.total += amount;
			}

			function Upgrades(upgrades){
				this.list = list;
				angular.extend(this, upgrades);
			}

			var upgrades = new Upgrades({
				skinning: 		new Upgrade("Skinning", 	{skins:10},		{ food:{ produceSpecialChance:.1 } }),
				harvesting:		new Upgrade("Harvesting",	{herbs:10},		{ wood:{ produceSpecialChance:.1 } }),
				prospecting: 	new Upgrade("Prospecting", 	{ore:10},		{ stone:{ produceSpecialChance:.1 } }),

				masonry: 		new Upgrade("Masonry",		{wood:100, stone:100})
			});

			return upgrades;
		})

})();