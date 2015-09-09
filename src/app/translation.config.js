/* global Q, console */
// translation.config.js

(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.config(['$translateProvider',
			function($translateProvider) {

				$translateProvider.useLoader('clientSpecificLoader');

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
		.factory('clientSpecificLoader', clientSpecificLoader);

	/** @ngInject */
	function clientSpecificLoader(couchdb) {
		// return loaderFn
		return function(options) {
			// language selected stored in "options.key"
			function mergeThe2Json(globalTranslation, clientSpecific) {
				// if a tag is in JSON1 then keep that one and ignore the identical tag in the globalTranslation.
				if (clientSpecific && globalTranslation) {
					mergedTranslation = angular.extend({}, globalTranslation, clientSpecific);
				} else {
					mergedTranslation = globalTranslation;
				}
				// Step2: Merge the User/client translation with the Global one.
				deferred.resolve(mergedTranslation);

			}

			function fetchSpecificTranslation(globalTranslation) {
				var specificDeffered = Q.defer();
				couchdb.getUserTranslation('specific_' + options.key)
					.then(
						function(response) {
							specificDeffered.resolve(response);
							// Get the Specific translation from the code:
							mergeThe2Json(globalTranslation, response.translation);
						},
						function(reason) {
							specificDeffered.reject(reason);
							// The specific translation did not resolve, so use the Global one only.
							mergeThe2Json(globalTranslation);
						})
					.fail(function(exception) {
						mergeThe2Json(globalTranslation);
						// Translation tag probably do not exist.
						console.log("Could not load client Specific Translation", exception, exception.stack);
					});
			}

			var mergedTranslation = {};
			var deferred = Q.defer();
			var globalDeferred = Q.defer();
			// step1: Get the right translation from the global CouchDB folder (we dont know who is login yet, so it have to be a separate folder). 
			couchdb.getUserTranslation('global_' + options.key)
				.then(
					function(response) {
						globalDeferred.resolve(response);
						// Get the global translation from the code:
						fetchSpecificTranslation(response.translation);
					},
					function(reason) {
						// Fail fetchign the global translation, so maybe the DB is not there or all the translation tag are not there
						globalDeferred.reject(reason);
					})
				.fail(function(exception) {
					// Fail fetchign the global translation, so maybe the DB is not there or all the translation tag are not there
					console.warn("Could not load Global Translation ", exception, exception.stack);
				});

			// resolve with translation data
			return deferred.promise;
		};
	};
})();