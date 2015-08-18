/* global Q, console */

(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('NavbarController', NavbarController);

	/** @ngInject */
	function NavbarController($scope, $rootScope, $location, AuthenticationService, $translate, couchdb) {
		var vm = this;
		vm.logout = logout;
		vm.changeLanguage = changeLanguage;
		vm.currentUserName = "";

		if ($rootScope.globals && $rootScope.globals.currentUser && $rootScope.globals.currentUser.name) {
			vm.currentUserName = $rootScope.globals.currentUser.name;
		} else {
			// Probably not log-in so Investigate why
			vm.currentUserName = $rootScope.globals;
		}

		function logout() {
			console.log("Logout");

			var deferred = Q.defer();
			AuthenticationService.logout()
				.then(
					function(response) {
						deferred.resolve(response);
						AuthenticationService.ClearCredentials();
						$location.path('/login');
						// Digest because Angular do not know when the promesses is returned
						$scope.$apply();
					},
					function(reason) {
						deferred.reject(reason);
						console.warn("there was an error in the Logout ", reason);
						$scope.$digest();
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}

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