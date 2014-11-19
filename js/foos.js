(function(){

	angular.module('foos', ['gameElements'])
		.factory('foos', ['gameElements', 'gameElement', function(gameElements, gameElement){

			function Foo(name, opts){
				this.name = name || "";
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
				this.image = "./images/resources/"+this.name.toLowerCase().replace(/\s/g,'')+".svg";

				angular.extend(this, opts);
				this.baseMax = this.max;

			}
			Foo.prototype = new gameElement();
			Foo.prototype.constructor = Foo;


			function Foos(){

			}
			Foos.prototype = new gameElements( Foo );
			Foos.prototype.constructor = Foos;


			var foos = new Foos();


			var barBazTaz = foos.add("Bar Baz Taz");
			barBazTaz.options({
				max: 200,
			});


			console.log( foos, barBazTaz )

			return foos;

		}])

}());