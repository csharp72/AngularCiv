angular.module('gameElements')
	.factory('population', [function(){
		function Population(){
			this.total = 0;
			this.max = 0;
		}

		Population.prototype.reset = function(){
			population = newPopulation();
		}

		function newPopulation(){
			return new Population();
		}

		var population = newPopulation();
		return population;
	}])
	
