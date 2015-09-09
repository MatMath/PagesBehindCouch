// translation.config.js
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.config(['$translateProvider',
			function($translateProvider) {

				$translateProvider.useLoader('customLoader');

				$translateProvider.preferredLanguage('en');
				$translateProvider.useLocalStorage();
				$translateProvider.useSanitizeValueStrategy('escape');

			}
		]);
})();

(function() {
	'use strict';
	angular
		.module('pagesBehindCouch')
		.factory('customLoader', function($http, $q) {
			// return loaderFn
			return function(options) {
				// step1: Get the right translation from the user CouchDB. 
				// Step2: Merge the User/client translation with the Global one.
				var deferred = $q.defer();
				// do something with $http, $q and key to load localization files

				var data = {
					'TEXT': 'Fooooo'
				};

				deferred.resolve(data);
				
				// resolve with translation data
				return deferred.promise;
			};
		});
})();