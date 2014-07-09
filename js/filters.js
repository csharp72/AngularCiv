angular.module('app')
	.filter('int', function(){
		return function(num){
			return Math.floor(num);
		}
	})
	.filter('float1', function(){
		return function(num){
			return num.toFixed(1);
		}
	})

	.filter('displayCost', ['resources', function(resources){
		return function(cost){
			var str = "";
			angular.forEach(cost, function(amount, name){
				str += resources[name].name + ": " + amount + " ";
			})
			return str;
		}
	}])