(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('MainController', MainController);

	/** @ngInject */
	function MainController() {
		//Body here
		var vm = this;
		vm.fetchDashboardInfo = fetchDashboardInfo;
		vm.openInspection = openInspection;
		vm.createBlankAssignment = createBlankAssignment;
		vm.fullDashboardInfo = "";

		(function initController() {
			
			vm.fetchDashboardInfo()
		})();

		function fetchDashboardInfo() {
			var deferred = Q.defer();
			couchdb.getCouchDBInfo('stages')
			.then(
				function(response) {
					deferred.resolve(response);
					console.log("success", response);
					vm.fullDashboardInfo = response;
					$scope.$digest();
				},
				function(reason) {
					deferred.reject(reason);
					vm.fullDashboardInfo = reason;
					$scope.$digest();
				})
			.fail(function(exception) {
				console.warn("there was an exception ", exception, exception.stack);
			});

		}

	}
})();