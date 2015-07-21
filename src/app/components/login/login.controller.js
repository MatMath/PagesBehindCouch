/* global Q, console */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$scope', '$location', 'AuthenticationService'];

	function LoginController($scope, $location, AuthenticationService) {
		var vm = this;
		vm.login = login;
		vm.listOfUser = [];

		(function initController() {
			AuthenticationService.validateWhoIsLogin();
			// At opening, fetch all user that are already login in the system (DB already downloaded in couchdb)
			fetchAlreadyDownloadeduser();
			// reset login status
			// AuthenticationService.ClearCredentials();
		})();

		function login() {
			vm.dataLoading = true;
			var deferred = Q.defer();

			AuthenticationService.Login(vm.username, vm.password)
				.then(
					function(response) {
						deferred.resolve(response);
						vm.dataLoading = false;
						AuthenticationService.SetCredentials(response);
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

		function fetchAlreadyDownloadeduser() {
			// At opening, fetch all user that are already login in the system (DB already downloaded in couchdb)

			var deferred = Q.defer();
			AuthenticationService.getAllLocalDB()
				.then(
					function(response) {
						deferred.resolve(response);
						for (var i = response.length - 1; i >= 0; i--) {
							if (response[i].indexOf('tabletbackup') > -1) {
								// keep between the first "-" and until the last "-".
								vm.listOfUser.push(response[i].substring(response[i].indexOf('-') + 1, response[i].lastIndexOf('-')));
							}
						}
						$scope.$digest();
					},
					function(reason) {
						deferred.reject(reason);
						// Do some Alert msg
						// vm.listOfUser = reason;
						$scope.$digest();
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}
	}

})();