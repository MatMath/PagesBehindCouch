/* global Q, console */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('docNavbarCtrl', docNavbarCtrl);

	/** @ngInject */
	function docNavbarCtrl(AuthenticationService, $translate, $scope, couchdb) {
		var vm = this;
		vm.changeLanguage = changeLanguage;
		vm.currentUserName = "";

		(function initController() {
			// Validate if the user is still login and have access to his DB. 
			// I have to pass the scope in order to trigger scope.$apply();
			AuthenticationService.validateWhoIsLogin($scope);
		})();

		function changeLanguage(key) {
			console.log('language changed to ' + key);
			$translate.use(key);
			updateUserNewLangPreference(key);
		}

		function updateUserNewLangPreference(key) {
			var deferred2 = Q.defer();
			couchdb.getUserPreferences()
				.then(
					function(response) {
						deferred2.resolve(response);
						response.lang = key;
						AuthenticationService.updateUserPreferences(response);
						couchdb.updateUserPreferences(response);
					},
					function(reason) {
						deferred2.reject(reason);
						if (reason.error === "not_found") {
							// Preferences are missing, so Write new one.
							var genericPreferences = {
								"_id": "user_preferences",
								"lang": key
							};
							AuthenticationService.updateUserPreferences(genericPreferences);
							couchdb.updateUserPreferences(genericPreferences);
						}
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}
	}

})();