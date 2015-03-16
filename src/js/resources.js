(function(){

	angular.module('resources', [])
		.factory('resources', [function(){

			var currId = 0;
			function nextId(){
				return currId++;
			}

			var list = [];

			function Resource(name, opts){
				this.name = name;
				this.total = 0;
				this.specialChance = 0.1;
				this.collectSpecialChance = 0.1;
				this.produceSpecialChance = 0;
				this.max = false;
				this.baseMax = false;
				this.collectRate = 1;
				this.productionRate = 0;
				this.consumptionRate = 0;
				this.grossRate = 0;
				this.image = "./images/resources/"+name.toLowerCase()+".svg";

				angular.extend(this, opts);
				this.baseMax = this.max;

				list.push( this );
			}

			Resource.prototype.collect = function(){
				var diceRoll = false;
				if( this.max === false || this.total < this.max ){
					this.total = this.max ? Math.min( this.total + this.collectRate, this.max ) : this.total + this.collectRate;
					if( this.specialResource ){
						diceRoll = Math.random() < this.collectSpecialChance;
						if( diceRoll ){
							this.specialResource.total += this.collectRate;
						}
					}
					return [this, diceRoll];
				}
				return false;
			}

			Resource.prototype.produce = function(){
				if( this.max === false ){
					this.total = Math.max( this.total + this.productionRate - this.consumptionRate, 0 );
					rollForSpecial.call( this );
				}else{
					if( this.total < this.max ){
						rollForSpecial.call( this );
					}
					this.total = Math.max( Math.min( this.total + this.productionRate - this.consumptionRate, this.max ), 0 );
				}

				function rollForSpecial(){
					if( this.specialResource && this.productionRate > 0 ){
						if( Math.random() < this.produceSpecialChance ){
							this.specialResource.total += Math.max( (this.productionRate - this.consumptionRate) / 5, 0 );
						}
					}
				}
			}

			function Resources(res){
				angular.extend(this, res);
			}

			Resources.prototype.list = list;

			Resources.prototype.enough = function( enoughResources, multiplier ){
				var enough = true;
				var multiplier = multiplier || 1;
				angular.forEach(enoughResources, function(amount, type){
					if( this[type].total < amount * multiplier ){
						enough = false;
					}
				}.bind(this))
				return enough;
			}

			Resources.prototype.use = function( useResources, multiplier ){
				var multiplier = multiplier || 1;
				if( this.enough(useResources, multiplier) ){
					angular.forEach(useResources, function(amount, type){
						this[type].total -= amount * multiplier;
					}.bind(this))
					return true;
				}
				return false;
			}

			Resources.prototype.add = function( addResources, multiplier ){
				var multiplier = multiplier || 1;
				angular.forEach(addResources, function(amount, type){
					if( this[type].max > 0 ){
						this[type].total = Math.min( this[type].total + amount, this[type].max );
					}else{
						this[type].total += amount;
					}
				}.bind(this))
			}

			Resources.prototype.produce = function(){
				angular.forEach(this, function(resource){
					resource.produce();
				})
			}

			Resources.prototype.reset = function(){
				resources = newResources();
			}

			function newResources(){
				var resources = new Resources({
					food: new Resource('Food', 		{total:0, max:200}),
					wood: new Resource('Wood', 		{total:0, max:200}),
					stone: new Resource('Stone', 	{total:0, max:200}),

					skins: new Resource('Skins',	{total:0,}),
					herbs: new Resource('Herbs',	{total:0,}),
					ore: new Resource('Ore',		{total:0,}),

					leather: new Resource('Leather'),
					medicine: new Resource('Medicine'),
					metal: new Resource('Metal'),
				});

				resources.food.specialResource = resources.skins;
				resources.wood.specialResource = resources.herbs;
				resources.stone.specialResource = resources.ore;

				return resources;
			}

			var resources = newResources();
			return resources;
		}])

})();