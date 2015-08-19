/* global CORS */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.service('couchdb', couchdb);

	/** @ngInject */
	function couchdb(AuthenticationService) {
		//Body here
		var vm = this;
		vm.getCouchDBInfo = getCouchDBInfo;
		vm.getUserPreferences = getUserPreferences;
		vm.updateUserPreferences = updateUserPreferences;

		function getCouchDBInfo(mapReduce) {
			if (mapReduce) {
				var url = AuthenticationService.getMapReduceLocation() + mapReduce;
				return CORS.makeCORSRequest({
					url: url,
					method: "GET"
				});
			}
		}

		function getUserPreferences() {
			var url = AuthenticationService.getUserPreferencesLocation();
			return CORS.makeCORSRequest({
				url: url,
				method: "GET"
			});
		}

		function updateUserPreferences(preferences) {
			if (preferences) {
				var url = AuthenticationService.getUserPreferencesLocation();
				return CORS.makeCORSRequest({
					url: url,
					method: "PUT",
					data: preferences
				});
			};
		}
	}
})();