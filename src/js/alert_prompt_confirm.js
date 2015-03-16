angular.module('alertPromptConfirm', [])

	// I define an asynchronous wrapper to the native alert() method. It returns a
	// promise that will be resolved in a future tick of the event loop.
	// --
	// NOTE: This promise will never be "rejected" since there is no divergent
	// behavior available to the user with the alert() method.
	.factory("alert",
		['$window', '$q', '$timeout',
		function( $window, $q, $timeout ) {
	 
			// Define promise-based alert() method.
			function alert( message ) {
				
				var defer = $q.defer();
				
				$timeout(function(){
					$window.alert( message );
					defer.resolve();
				})
				
				return( defer.promise );

			}
			 
			return( alert );
		 
		}]
	)
	 
	 
	// I define an asynchronous wrapper to the native prompt() method. It returns a
	// promise that will be "resolved" if the user submits the prompt; or will be
	// "rejected" if the user cancels the prompt.
	.factory("prompt",
		['$window', '$q', '$timeout',
		function( $window, $q, $timeout ) {
	 
			// Define promise-based prompt() method.
			function prompt( message, defaultValue ) {
				var defaultValue = defaultValue || "";
		 
				var defer = $q.defer();
		 
				// The native prompt will return null or a string.
				$timeout(function(){
					var response = $window.prompt( message, defaultValue );
					if ( response === null ) {
						defer.reject();
					} else {
						defer.resolve( response );
					}
				})
		 
				return( defer.promise );
		 
			}
		 
			return( prompt );
	 
		}]
	)
	 
	 
	// I define an asynchronous wrapper to the native confirm() method. It returns a
	// promise that will be "resolved" if the user agrees to the confirmation; or
	// will be "rejected" if the user cancels the confirmation.
	.factory("confirm",
		['$window', '$q', '$timeout',
		function( $window, $q, $timeout ) {
		 
			// Define promise-based confirm() method.
			function confirm( message ) {
			 
				var defer = $q.defer();
				 
				// The native confirm will return a boolean.
				$timeout(function(){
					if ( $window.confirm( message ) ) {
						defer.resolve( true );
					} else {
						defer.reject( false );
					}
				})
				 
				return( defer.promise );
			 
			}
			 
			return( confirm );
		 
		}]
	)