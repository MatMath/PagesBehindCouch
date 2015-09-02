/* global document, Q, console */
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

		document.addEventListener("authentication:success", function() {
			// Since the user is Login, Access is Data.
			getCouchDBInspectionInfo();
		});

		(function initController() {
			// Validate if the user is still login and have access to his DB. 
			AuthenticationService.validateWhoIsLogin($scope);
		})();

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