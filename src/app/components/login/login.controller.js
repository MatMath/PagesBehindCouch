/* global Q, console, Event, document */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('LoginController', LoginController);

	/** @ngInject */
	function LoginController($scope, $location, AuthenticationService, $translate, couchdb) {
		var vm = this;
		vm.login = login;
		vm.logout = logout;
		vm.listOfUser = [];

		(function initController() {
			// Update the credential is the user is already login.
			validateWhoIsLogin();
			// At opening, fetch all user that are already login in the system (DB already downloaded in couchdb)
			fetchAlreadyDownloadeduser();
			// reset login status
			// AuthenticationService.ClearCredentials();
		})();

		function validateWhoIsLogin() {
			// At opening, fetch all user that are already login in the system (DB already downloaded in couchdb)

			var deferred = Q.defer();
			AuthenticationService.checkTheSession()
				.then(
					function(response) {
						deferred.resolve(response);
						if (response.userCtx) {
							// Update the Global with the current user.
							AuthenticationService.SetCredentials(response.userCtx);
							deferred.resolve(response.userCtx.name);
						}
						$scope.$digest();
					},
					function(reason) {
						// error while downloading the info from CouchDB.
						document.dispatchEvent(new Event("authentication:offline", reason));
						deferred.reject(reason);
					})
				.fail(function(exception) {
					var ev = new Event("bug");
					ev.from = "validateWhoIsLogin";
					ev.exception = exception;

					document.dispatchEvent(ev);
					deferred.reject("There is a problem, please Contact us");
				});
		}

		function login() {
			vm.dataLoading = true;
			var deferred = Q.defer();

			AuthenticationService.Login(vm.username, vm.password)
				.then(
					function(response) {
						deferred.resolve(response);
						vm.dataLoading = false;
						AuthenticationService.SetCredentials(response);
						// Get the Preferences from the CouchDB of the user only if the login did work.
						var deferred2 = Q.defer();
						couchdb.getUserPreferences()
							.then(
								function(response) {
									deferred2.resolve(response);
									AuthenticationService.updateUserPreferences(response);
									changeLanguage(response.lang);
								},
								function(reason) {
									deferred2.reject(reason);
									if (reason.error === "not_found") {
										// Preferences are missing, so Write new one.
										var genericPreferences = {
											"_id": "user_preferences",
											"lang": "en"
										};
										AuthenticationService.updateUserPreferences(genericPreferences);
										couchdb.updateUserPreferences(genericPreferences);
									}
									vm.dataLoading = false;
									// Digest because Angular do not know when the promesses is returned
									$scope.$digest();
								})
							.fail(function(exception) {
								console.warn("there was an exception ", exception, exception.stack);
							});
						$location.path('/notification');
						// Digest because Angular do not know when the promesses is returned
						$scope.$digest();
					},
					function(reason) {
						console.log("error", reason);
						deferred.reject(reason);
						vm.dataLoading = false;
						// Digest because Angular do not know when the promesses is returned
						$scope.$digest();
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}

		function logout() {
			console.log("Logout");
			AuthenticationService.ClearCredentials();

			var deferred = Q.defer();
			AuthenticationService.logout()
				.then(
					function(response) {
						deferred.resolve(response);
						// Already in Login page
						$scope.$digest();
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

		function fetchAlreadyDownloadeduser() {
			// At opening, fetch all user that are already login in the system (DB already downloaded in couchdb)

			var deferred = Q.defer();
			AuthenticationService.getAllLocalDB()
				.then(
					function(response) {
						deferred.resolve(response);
						for (var i = response.length - 1; i >= 0; i--) {
							if (response[i].indexOf('tabletbackup') > -1) {
								// keep between the first "-" and until the last "-".
								vm.listOfUser.push(response[i].substring(response[i].indexOf('-') + 1, response[i].lastIndexOf('-')));
							}
						}
						$scope.$digest();
					},
					function(reason) {
						deferred.reject(reason);
						// Do some Alert msg
						// vm.listOfUser = reason;
						$scope.$digest();
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}

		function changeLanguage(key) {
			console.log('language changed to ' + key);
			$translate.use(key);
		}
	}

})();