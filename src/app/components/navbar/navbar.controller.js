/* global Q, console */

(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('NavbarController', NavbarController);

	/** @ngInject */
	function NavbarController($scope, $rootScope, $location, AuthenticationService) {
		var vm = this;
		vm.logout = logout;
		vm.currentUserName = "";

		if ($rootScope.globals && $rootScope.globals.currentUser && $rootScope.globals.currentUser.name) {
			vm.currentUserName = $rootScope.globals.currentUser.name;
		} else {
			// Probably not log-in so Investigate why
			vm.currentUserName = $rootScope.globals;
		}

		function logout() {
			console.log("Logout");
			AuthenticationService.ClearCredentials();
			
			var deferred = Q.defer();
			AuthenticationService.logout()
				.then(
					function(response) {
						deferred.resolve(response);
						$location.path('/login');
						// Digest because Angular do not know when the promesses is returned
						$scope.$digest();
					},
					function(reason) {
						deferred.reject(reason);
						console.warn("there was an error in the Logout ", reason);
						$scope.$digest();
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}
	}

})();