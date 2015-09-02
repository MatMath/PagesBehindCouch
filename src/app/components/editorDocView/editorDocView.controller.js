/* global Q, console, document */
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

		document.addEventListener("authentication:success", function() {
			if ($rootScope.globals.currentUser && $rootScope.globals.currentUser.roles && $rootScope.globals.currentUser.roles.indexOf("manager") > -1) {
				// The user have manager right, so Fetch the data.
				openTheTemplateUUID($stateParams.uuid);
			} else {
				// No manager role, Back to the Main Dashboard.
				$location.path('/');
				$scope.$apply();
				return;
			}
		});

		(function initController() {
			// Validate if the user is still login and have access to his DB.
			// I have to pass the scope in order to trigger scope.$apply();
			AuthenticationService.validateWhoIsLogin($scope);
		})();

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