/* global Q, console */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$scope', '$location', 'AuthenticationService', 'FlashService'];

	function LoginController($scope, $location, AuthenticationService, FlashService) {
		var vm = this;
		vm.login = login;
		vm.logout = logout;

		(function initController() {
			// reset login status
			// AuthenticationService.ClearCredentials();
		})();

		function login() {
			vm.dataLoading = true;
			var deferred = Q.defer();

			AuthenticationService.Login(vm.username, vm.password)
				.then(
					function(response) {
						console.log("success", response);
						deferred.resolve(response);
						vm.dataLoading = false;
						AuthenticationService.SetCredentials(vm.username, vm.password, response);
						$location.path('/notification');
						// Digest because Angular do not know when the promesses is returned
						$scope.$digest();
					},
					function(reason) {
						console.log("error", reason);
						deferred.reject(reason);
						vm.dataLoading = false;
						// Digest because Angular do not know when the promesses is returned
						$scope.$digest();
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}

		function logout() {
			console.log("Logout");
			AuthenticationService.ClearCredentials();
		}
	}

})();