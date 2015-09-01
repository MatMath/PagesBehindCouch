/* global document, Q, Event,  console */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('tableviewController', tableviewController);

	/** @ngInject */
	function tableviewController(couchdb, $scope, $rootScope, $location, AuthenticationService) {
		//Body here
		var vm = this;
		vm.openThatDoc = openThatDoc;
		vm.getCouchDBInspectionInfo = getCouchDBInspectionInfo;
		vm.inspectionInfo = "";

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
							getCouchDBInspectionInfo();
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

		function getCouchDBInspectionInfo() {
			// All inspection assigned to the user.
			var deferred = Q.defer();
			couchdb.getCouchDBInfo('byStage2')
				.then(
					function(response) {
						deferred.resolve(response);
						vm.inspectionInfo = response;
						$scope.$digest();
					},
					function(reason) {
						deferred.reject(reason);
						vm.inspectionInfo = reason;
						$scope.$digest();
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}

		function openThatDoc (UUID) {
			// Middle step Instead of opening the page directly in case we want to validate something before opening the Doc.
			if (!UUID) {
				return;
			}
			// Redirect the user to the DocView + That page should open + display that doc.
			$location.path('/docview/'+ UUID);
		}

	}
})();