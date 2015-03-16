(function(){

	angular.module('upgrades', [])

		.factory('upgrades', ['resources','jobs', function(resources, jobs){

			var currId = 0;
			function nextId(){
				return currId++;
			}

			var list = [];

			function Upgrade(name, cost, benefits, requirements){
				this.id = nextId();
				this.name = name;
				this.total = 0;
				this.aquired = function(){return this.total > 0};
				this.cost = cost || {};
				this.benefits = benefits || [];
				this.requirements = requirements || [];
				this.requirementsMet = true;

				list.push( this );
			}

			Upgrade.prototype.aquire = function(amount){
				var amount = amount || 1;
				this.total += amount;
			}

			function Upgrades(upgrades){
				angular.extend(this, upgrades);
			}

			Upgrades.prototype.list = list;

			Upgrades.prototype.reset = function(){
				upgrades = newUpgrades();
			}
			
			function newUpgrades(){
				return new Upgrades({
					skinning: 		new Upgrade("Skinning", 		{skins:10},					[["Gatherers can produce skins", 	{food:{produceSpecialChance:.1}}]]  	),
					harvesting:		new Upgrade("Harvesting",		{herbs:10},					[["Wood Cutters can produce herbs", {wood:{produceSpecialChance:.1}}]] 		),
					prospecting: 	new Upgrade("Prospecting", 		{ore:10},					[["Miners can produce ore", 		{stone:{produceSpecialChance:.1}}]]		),

					basket: 		new Upgrade("Berry Basket",		{food: 300}, 				[["Gather 2 food per click", 		{food:{collectRate:1}}]],				["skinning"]),
					saw: 			new Upgrade("Wood Saw", 		{wood: 300}, 				[["Gather 2 wood per click", 		{wood:{collectRate:1}}]]				),
					pickaxe: 		new Upgrade("Pickaxe", 			{stone: 300}, 				[["Gather 2 stone per click", 		{stone:{collectRate:1}}]]				),

					masonry: 		new Upgrade("Masonry",			{wood:100, stone:100},		[["Unlock more buildings and upgrades"]]									),

					//something: 		new Upgrade("Something",	{wood:100, stone:100},		[["Unlock more buildings and upgrades"]], ["masonry"]					),
				});
			}

			var upgrades = newUpgrades();
			return upgrades;
		}])

})();