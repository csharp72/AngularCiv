(function(){

	angular.module('resources', [])
		.factory('resources', function(){

			function Resource(name, opts){
				this.name = name
				this.total = 0
				this.specialChance = 0
				this.max = false;
				this.increment = 1
				this.productionRate = 0

				this.collect = function(){
					if( this.max === false || this.total < this.max ){
						this.total = this.max ? Math.min( this.total + this.increment, this.max ) : this.total + this.increment;
						if( this.specialResource ){
							if( Math.random() < this.specialChance ){
								this.specialResource.total += this.increment;
							}
						}
					}
				}

				this.produce = function(){
					if( this.max === false ){
						this.total = Math.max( this.total + this.productionRate, 0 );
					}else{
						this.total = Math.max( Math.min( this.total + this.productionRate, this.max ), 0 );
						if( this.specialResource && this.productionRate > 0 ){
							if( Math.random() < this.specialChance ){
								this.specialResource.total += Math.round(this.productionRate);
							}
						}
					}
				}

				angular.extend(this, opts);
			}

			function Resources(res){
				angular.extend(this, res);
			}

			var resources = new Resources({
				food: new Resource('Food', {total:40, max:200, specialChance: 0.1}),
				wood: new Resource('Wood', {total:40, max:200, specialChance: 0.1}),
				stone: new Resource('Stone', {max:200, specialChance: 0.1}),

				skins: new Resource('Skins',{total:40,}),
				herbs: new Resource('Herbs'),
				ore: new Resource('Ore'),

				leather: new Resource('Leather'),
				piety: new Resource('Piety'),
				metal: new Resource('Metal'),
			});

			resources.food.specialResource = resources.skins;
			resources.wood.specialResource = resources.herbs;
			resources.stone.specialResource = resources.ore;

			Resources.prototype.basic = [resources.food, resources.wood, resources.stone];

			Resources.prototype.enough = function( enoughResources, multiplier ){
				var enough = true;
				var multiplier = multiplier || 1;
				angular.forEach(enoughResources, function(amount, type){
					if( this[type].total < amount * multiplier ){
						enough = false;
					}
				}.bind(resources))
				return enough;
			}

			Resources.prototype.use = function( useResources, multiplier ){
				var multiplier = multiplier || 1;
				if( this.enough(useResources, multiplier) ){
					angular.forEach(useResources, function(amount, type){
						this[type].total -= amount * multiplier;
					}.bind(resources))
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
				}.bind(resources))
			}

			Resources.prototype.produce = function(){
				angular.forEach(resources, function(resource){
					resource.produce();
				})
			}

			return resources;
		})

		

})();