angular.module('filters', [])
	.filter('int', function(){
		return function(num){
			return Math.floor(num);
		}
	})
	.filter('shortNum', [function(){
		return function(num, decimalPlace){
			var decimalPlace = decimalPlace || 1;
			
			if( num >= 1e15 ){
				return addFloat( num / 1e15, decimalPlace ) + "Q";
			}else if( num >= 1e12 ){
				return addFloat( num / 1e12, decimalPlace ) + "T";
			}else if( num >= 1e9 ){
				return addFloat( num / 1e9, decimalPlace ) + "B";
			}else if( num >= 1e6 ){
				return addFloat( num / 1e6, decimalPlace ) + "M";
			}else if( num >= 1e3 ){
				return addFloat( num / 1e3, decimalPlace ) + "K";
			}else{
				return addFloat( num, decimalPlace );
			}

			function addFloat( val, decimalPlace ){
				var val = parseFloat( val.toFixed(decimalPlace) );
				if( val % 1 ){
					return val;
				}else{
					return val.toFixed( 0 );
				}
			}
		}
	}])

	.filter('displayCost', ['resources','$sce', function(resources, $sce){
		return function(cost, multiplier){
			var multiplier = multiplier || 1;
			var str = "";
			if( !$.isEmptyObject(cost) ){
				angular.forEach(cost, function(amount, name){
					var res = resources[name];
					str += "<span ng-class='{ready:resources.enough({"+name+":"+amount*multiplier+"})}' class='cost-resource " + name +"'><img src='"+res.image+"' alt='"+res.name+"' /><span class='cost-amount'>" + amount*multiplier + "</span></span>";
				})
			}
			return $sce.trustAsHtml(str);
		}
	}])

	.filter('commaDelimited', [function(){
		return function(num){
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
	}])

