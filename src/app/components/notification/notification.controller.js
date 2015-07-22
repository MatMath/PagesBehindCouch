/* global Q, console, document, Event */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('NotificationController', NotificationController);

	/** @ngInject */
	function NotificationController(couchdb, $scope, $rootScope, $location, AuthenticationService) {
		//Body here
		var vm = this;
		vm.getCouchDBDashboardInfo = getCouchDBDashboardInfo;
		vm.mapReduceData = {};
		vm.filteredData = {
			responseRowLength:0,
			newForm: {
				total: 0
			},
			started: {
				total: 0,
				passing: 0,
				hold: 0,
				failing: 0
			},
			completed: {
				total: 0,
				passing: 0,
				hold: 0,
				failing: 0
			},
			pendingProcessing: {
				total: 0,
				passing: 0,
				hold: 0,
				failing: 0
			}
		};

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
							if ($rootScope.globals.currentUser.name !== response.userCtx.name) {
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
						$scope.digest();
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

		function getCouchDBDashboardInfo() {
			var deferred = Q.defer();
			couchdb.getCouchDBInfo('byStage2')
				.then(
					function(response) {
						deferred.resolve(response);
						console.log("success", response);
						vm.mapReduceData = response;
						splitIntoCompletedLevel(response);
						$scope.$digest();
					},
					function(reason) {
						deferred.reject(reason);
						vm.mapReduceData = reason;
						$scope.$digest();
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}

		function splitIntoCompletedLevel(response) {
			console.log(response);

			function setInProperObject(objectToAddTo) {
				objectToAddTo.total = objectToAddTo.total + 1;
				// Test: If total = passing+hold+failing
				if (finalResult === "Accept") {
					objectToAddTo.passing = objectToAddTo.passing + 1;
				} else if (finalResult === "On Hold" || finalResult === "LowQty") {
					objectToAddTo.hold = objectToAddTo.hold + 1;
				} else if (finalResult === "Reject") {
					objectToAddTo.failing = objectToAddTo.failing + 1;
				}
			}

			if (response && response.rows && response.rows.length > 0) {
				// Test: If Total of all section == response.rows.length --> We will see if we miss some value.
				vm.filteredData.responseRowLength = response.rows.length;
				for (var row = response.rows.length - 1; row >= 0; row--) {
					
					// Here Split them between New, Started New/failing, Completed New/failing
					var globalStatus = response.rows[row].value.status; // New || Form Started || Completed || (Submitted || Deleted || Archived || Transferred)
					var finalResult = response.rows[row].value.conclusion; // "" || Accept || ( On Hold || LowQty ) || Reject
					var pendingProcessingStatus = ["Submitted", "Deleted", "Archived", "Transferred"];
					if (globalStatus === "New") {
						vm.filteredData.newForm.total = vm.filteredData.newForm.total+ 1;
					} else if (globalStatus === "Form Started") {
						setInProperObject(vm.filteredData.started);
					} else if (globalStatus === "Completed") {
						setInProperObject(vm.filteredData.completed);
					} else if (pendingProcessingStatus.indexOf(globalStatus) > -1) {
						setInProperObject(vm.filteredData.pendingProcessing);
					}
				}
			}
		}
	}
})();