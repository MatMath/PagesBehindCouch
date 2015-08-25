/* global Q, console, document, Event */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('DocviewController', DocviewController);

	/** @ngInject */
	function DocviewController(AuthenticationService, $rootScope, $scope, $location) {
		//Body here
		var vm = this;
		console.log("Loading the DocviewController");

		(function initController() {
			// Validate if the user is still login and have access to his DB. 
			validateWhoIsLogin();
		})();

		function validateWhoIsLogin() {
			// At opening, fetch all user that are already login in the system (DB already downloaded in couchdb)

			var deferred = Q.defer();
			AuthenticationService.checkTheSession()
				.then(
					function(response) {
						deferred.resolve(response);
						if (!response.userCtx || !response.userCtx.name) {
							if (!$rootScope.globals.currentUser || !$rootScope.globals.currentUser.name) {
								// User is not login and is not set in the global variable, so redirect to the login page.
								$location.path('/login');
								$scope.$apply();
								return;
							} else {
								// Try to re-login the user with his know username. 
								document.dispatchEvent(new Event("authentication:reAuthenticate", $rootScope.globals.currentUser.name));
							}
							deferred.reject("user is not login");
						} else {
							if (!$rootScope.globals.currentUser || $rootScope.globals.currentUser.name !== response.userCtx.name) {
								// User in Global var and CouchDB do not match
								// Update the Global with the current user.
								AuthenticationService.SetCredentials(response.userCtx);
							} else {
								// The user already login match CouchDB
							}
							deferred.resolve(response.userCtx.name);
							// Fetch latest CouchDB Data.
							vm.getCouchDBDashboardInfo();
						}
						$scope.$digest();
					},
					function(reason) {
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
	}
})();