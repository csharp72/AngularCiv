angular.module('population', [])

	.factory('jobs', ['resources', function(resources){
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
			gatherer: 		new Job('Gatherer', 	{ production:{food:1.2} }),
			hunter: 		new Job('Hunter', 		{ cost:{wood:1,stone:1}, production:{food:3} }),
			farmer: 		new Job('Farmer', 		{ cost:{wood:20,stone:10}, production:{food:5} }),
			rancher: 		new Job('Rancher', 		{ cost:{wood:100,metal:100,food:300}, production:{food:8} }),
			woodcutter: 	new Job('Wood Cutter', 	{ production:{wood:1} }),
			miner: 			new Job('Miner', 		{ production:{stone:1} }),
		})

		return jobs;
	}])

	.factory('Worker', ['jobs', function(jobs){

		function Worker( job ){
			this.job = job || jobs.unemployed;
			this.sick = false;
			this.dead = false;
		}

		return Worker;
	}])

	.factory('population', ['Worker', 'jobs', 'resources', function(Worker, jobs, resources){
		function Population(){
			this.total = 0;
			this.max = 0;
			this.workers = [];
			this.jobs = jobs;
		}

		var population = new Population();

		Population.prototype.makeWorker = function(amount){
			var amount = amount || 1;
			if( this.total * amount <= this.max ){
				if( resources.use( this.jobs.unemployed.cost ) ){
					for( var i=0; i<amount; i++ ){
						this.workers.push( new Worker( this.jobs.unemployed ) );
					}
					this.total = this.workers.length;
				}
			}
		}

		Population.prototype.getJobWorkers = function( job, amount ){
			var amount = amount || 0;
			var cnt = 0;
			var workers = this.workers.filter(function(worker){
				if( !amount || cnt != amount ){
					if( worker.job == job ){
						cnt++;
						return true;
					}
				}
			});
			if( amount ) console.log( job.name, workers )
			return workers;
		}

		Population.prototype.getJobTotal = function( job ){
			return this.getJobWorkers(job).length;
		}

		Population.prototype.assign = function(job, amount){
			var amount = amount || 1;
			var workers = this.getJobWorkers( jobs.unemployed, amount );
			if( workers ){
				angular.forEach(workers, function(worker){
					worker.job = job;
				})
			}
		}

		Population.prototype.relieve = function(job, amount){
			var amount = amount || 1;
			var workers = this.getJobWorkers( job, amount );
			console.log('relieve', amount, workers)
			if( workers ){
				angular.forEach(workers, function(worker){
					worker.job = jobs.unemployed;
				})
			}
		}

		Population.prototype.canAssign = function( job, amount ){
			var amount = amount || 1;
			return resources.enough( job.cost, amount );
		}

		return population;
	}])
	
