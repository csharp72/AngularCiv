angular.module('filters', [])
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

	.filter('displayCost', ['resources','$sce', function(resources, $sce){
		return function(cost){
			var str = "";
			if( !$.isEmptyObject(cost) ){
				str += "<span class='cost-display'>";
				angular.forEach(cost, function(amount, name){
					var res = resources[name];
					str += "<span ng-class='{ready:resources.enough({"+name+":"+amount+"})}' class='cost-resource " + name +"'><img src='"+res.image+"' alt='"+res.name+"' /><span class='cost-amount'>" + amount + "</span></span>";
				})
				str += "</span>"
			}
			return $sce.trustAsHtml(str);
		}
	}])

