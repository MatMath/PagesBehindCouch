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
			// This Event is trigger by the navbar at loading, When the navbar is authenticating the user, it will propagate this even and launch the Data retrival.
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