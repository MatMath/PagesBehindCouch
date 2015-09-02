/* global Q, console, document */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('editorMainController', editorMainController);

	/** @ngInject */
	function editorMainController(couchdb, $scope, $rootScope, $location) {
		//Body here
		var vm = this;
		vm.getCouchDBDashboardInfo = getCouchDBDashboardInfo;
		vm.openThatTemplate = openThatTemplate;
		vm.mapReduceData = {};

		document.addEventListener("authentication:success", function() {
			// This Event is trigger by the navbar at loading, When the navbar is authenticating the user, it will propagate this even and launch the Data retrival.
			if ($rootScope.globals.currentUser && $rootScope.globals.currentUser.roles && $rootScope.globals.currentUser.roles.indexOf("manager") > -1) {
				// The user have manager right, so Fetch the data.
				getCouchDBDashboardInfo();
			} else {
				// No manager role, Back to the Main Dashboard.
				$location.path('/');
				$scope.$apply();
				return;
			}
		});

		function getCouchDBDashboardInfo() {
			// TODO: Fetch from the Admin master DB instead of the User DB, so we can replicate the template to all User after
			var deferred = Q.defer();
			couchdb.getCouchDBInfo('getStagesFromTemplate')
				.then(
					function(response) {
						deferred.resolve(response);
						vm.mapReduceData = response;
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

		function openThatTemplate (UUID) {
			// Middle step Instead of opening the page directly in case we want to validate something before opening the Doc.
			if (!UUID) {
				return;
			}
			// Redirect the user to the DocView + That page should open + display that doc.
			$location.path('/editor/'+ UUID);
		}
	}
})();