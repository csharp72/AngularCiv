(function(){

	function GameElement(name, desc){
		this.name = name;
		this.desc = desc || "";
	}
	GameElement.prototype.options = function(opts){
		angular.extend( this, opts );
	}



	function GameElements( gameElement ){
		this.gameElement = gameElement || null;
	}
	GameElements.prototype = {
		list: [],
		add: function(name, desc){
			var ge = new this.gameElement(name, desc);
			var key = name.substr(0,1).toLowerCase().concat( name.substr(1) ).replace(/\s/g,'');
			if( !this[key] ){
				this[key] = ge;
				this.list.push( ge );
			}else{
				console.error(name + ' already exists in ' + this.constructor.name)
			}
			return this[key];
		}
	}




	angular.module('gameElements')

			.factory('gameElement', function(){
				return GameElement;
			})

			.factory('gameElements', function(){
				return GameElements;
			})
}())