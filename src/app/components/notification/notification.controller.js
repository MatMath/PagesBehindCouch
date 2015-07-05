/* global Q, console */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('NotificationController', NotificationController);

	NotificationController.$inject = ['couchdb', '$scope'];
	/** @ngInject */
	function NotificationController(couchdb, $scope) {
		//Body here
		var vm = this;
		vm.getCouchDBDashboardInfo = getCouchDBDashboardInfo;
		vm.mapReduceData = {};

		(function initController() {
			// Fetch latest CouchDB Data.
			vm.getCouchDBDashboardInfo();
		})();

		function getCouchDBDashboardInfo() {
			var deferred = Q.defer();
			couchdb.getCouchDBInfo('status')
			.then(
				function(response) {
					deferred.resolve(response);
					console.log("success", response);
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
	}
})();