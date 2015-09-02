/* global Q, console, document */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('DocviewController', DocviewController);

	/** @ngInject */
	function DocviewController(AuthenticationService, $rootScope, $scope, $location, couchdb, $stateParams) {
		//Body here
		console.log("Loading the DocviewController");

		document.addEventListener("authentication:success", function() {
			// Since the user is Login, Access is Data.
			openTheDocUUID($stateParams.uuid);
		});

		(function initController() {
			// Validate if the user is still login and have access to his DB. 
			// I have to pass the scope in order to trigger scope.$apply();
			AuthenticationService.validateWhoIsLogin($scope);
		})();

		function openTheDocUUID(UUID) {
			if (UUID) {
				var deferred = Q.defer();
				couchdb.getDocData(UUID)
					.then(
						function(response) {
							deferred.resolve(response);
							preOpeningTreatment(response);
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

		function preOpeningTreatment(docData) {
			$scope.docdata = "initialelement";
			/* If we want to do manipulation to the Doc before we open it like:
				- Loop into it and set the Menu
				- Update the old version of that doc to the new version (bridge system)
				- pre-validation of what is to display
			*/
			// Set the docData to be somewhere accecible by this Controller function/factory/services and also from the Sub-ClientSpecificFunction. --> in the Scope or ???
			$scope.docdata = docData;
		}

	}
})();