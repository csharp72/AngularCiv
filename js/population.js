angular.module('population', [])

	.factory('population', [function(){
		function Population(){
			this.total = 0;
			this.max = 0;
		}

		var population = new Population();

		return population;
	}])

	.factory('jobs', ['resources','population', function(resources, population){
		function Job( name, opts ){
			this.name = name;
			this.total = 0;
			this.sick = 0;
			this.dead = 0;
			this.production = {};
			this.cost = {};

			angular.extend(this, opts);
		}

		function Jobs(opts){
			angular.extend(this, opts);
		}

		var jobs = new Jobs({
			unemployed: 	new Job('Unemployed', 	{ cost:{food:20} }),
			farmer: 		new Job('Farmer', 		{ production:{food:1.2} }),
			hunter: 		new Job('Hunter', 		{ cost:{wood:1,stone:1}, production:{food:3} }),
			rancher: 		new Job('Rancher', 		{ cost:{wood:100,metal:100,food:300}, production:{food:8} }),
			woodcutter: 	new Job('Wood Cutter', 	{ production:{wood:1} }),
			miner: 			new Job('Miner', 		{ production:{stone:1} }),
		})

		Jobs.prototype.makeWorker = function(amount){
			var amount = amount || 1;
			if( population.total * amount <= population.max ){
				if( resources.use( jobs.unemployed.cost ) ){
					jobs.unemployed.total += amount;
				}
			}
		}

		Jobs.prototype.assign = function(job, amount){
			var amount = amount || 1;
			if( jobs.unemployed.total >= amount ){
				job.total += amount;
				jobs.unemployed.total -= amount;
			}
		}

		Jobs.prototype.relieve = function(job, amount){
			var amount = amount || 1;
			if( job.total >= amount ){
				job.total -= amount;
				jobs.unemployed.total += amount;
			}
		}

		return jobs;
	}])
	
