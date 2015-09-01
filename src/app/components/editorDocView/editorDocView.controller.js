/* global Q, console, document, Event */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('editorDocController', editorDocController);

	/** @ngInject */
	function editorDocController(couchdb, $scope, $rootScope, $location, AuthenticationService, $stateParams) {
		//Body here
		var vm = this;
		vm.docTemplate = {};

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
								openTheTemplateUUID($stateParams.uuid);
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
							if ($rootScope.globals.currentUser.roles.indexOf("manager") === -1) {
								// The user do not have Manager right, and did endup on this page by error or hack
								$location.path('/');
								$scope.$apply();
								return;
							}
							// Fetch latest CouchDB Data.
							openTheTemplateUUID($stateParams.uuid);
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

		function openTheTemplateUUID(UUID) {
			if (UUID) {
				var deferred = Q.defer();
				couchdb.getDocData(UUID)
					.then(
						function(response) {
							deferred.resolve(response);
							vm.docTemplate = response;
							$scope.$digest();
						},
						function(reason) {
							deferred.reject(reason);
							$scope.$digest();
						})
					.fail(function(exception) {
						console.warn("there was an exception ", exception, exception.stack);
					});
			}
		}
	}
})();