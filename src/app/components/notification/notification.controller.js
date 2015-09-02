/* global Q, console, document */
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

		document.addEventListener("authentication:success", function() {
			// Since the user is Login, Access is Data.
			getCouchDBDashboardInfo();
		});

		(function initController() {
			// Validate if the user is still login and have access to his DB.
			// I have to pass the scope in order to trigger scope.$apply();
			AuthenticationService.validateWhoIsLogin($scope);
		})();

		function getCouchDBDashboardInfo() {
			var deferred = Q.defer();
			couchdb.getCouchDBInfo('byStage2')
				.then(
					function(response) {
						deferred.resolve(response);
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