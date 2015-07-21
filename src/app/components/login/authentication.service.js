/* global document, CORS, Q, Event */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.factory('AuthenticationService', AuthenticationService);

	AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$location'];

	function AuthenticationService($http, $cookies, $rootScope, $location) {
		var service = {};

		service.Login = Login;
		service.logout = logout;
		service.SetCredentials = SetCredentials;
		service.ClearCredentials = ClearCredentials;
		service.getMapReduceLocation = getMapReduceLocation;
		service.getBasicUrl = getBasicUrl;
		service.getAllLocalDB = getAllLocalDB;
		service.validateWhoIsLogin = validateWhoIsLogin;

		return service;

		function Login(username, password) {

			/* Use this for real authentication
						 ----------------------------------------------*/
			// Note: 
			// - CORS need to be activate on CouchDB
			// - CORS need to have "methods = GET, POST, PUT, DELETE"
			// - CouchDB do not seems to be able to log directly, need a extra service like a Node Login or Nginx

			return CORS.makeCORSRequest({
				url: 'https://localhost:6984/_session',
				method: "POST",
				data: {
					name: username,
					password: password
				},
			});
		}

		function logout() {
			return CORS.makeCORSRequest({
				url: 'https://localhost:6984/_session',
				method: "DELETE"
			});
		}

		function SetCredentials(extraInfo) {
			$rootScope.globals = {
				currentUser: extraInfo
			};
			$cookies.put('currentUser', $rootScope.globals);
		}

		function ClearCredentials() {
			if ($rootScope.globals.currentUser) {
				$rootScope.globals.currentUser = {};
			}
			$cookies.remove('currentUser');
		}

		function getBasicUrl() {
			return 'https://localhost:6984/';
		}

		function getMapReduceLocation() {
			return service.getBasicUrl() + 'testuser/_design/pages/_view/';
		}

		function getAllLocalDB() {
			var url = service.getBasicUrl() + '_all_dbs';
			// this url should work on all CouchDB.
			return CORS.makeCORSRequest({
				url: url,
				method: "GET"
			});
		}

		function checkTheSession() {
			var url = service.getBasicUrl() + '_session';
			// this url should work on all CouchDB.
			return CORS.makeCORSRequest({
				url: url,
				method: "GET"
			});
		}

		function validateWhoIsLogin() {
			// At opening, fetch all user that are already login in the system (DB already downloaded in couchdb)

			var deferred = Q.defer();
			checkTheSession()
				.then(
					function(response) {
						deferred.resolve(response);
						if (!response.userCtx || !response.userCtx.name) {
							if (!$rootScope.globals.currentUser || !$rootScope.globals.currentUser.name) {
								// User is not login and is not set in the global variable, so redirect to the login page.
								$location.path('/login'); 
							} else {
								// Try to re-login the user with his know username. 
								document.dispatchEvent(new Event("authentication:reAuthenticate", $rootScope.globals.currentUser.name));
							}
							deferred.reject("user is not login");
						} else {
							if ($rootScope.globals.currentUser.name !== response.userCtx.name) {
								// User in Global var and CouchDB do not match
								// Update the Global with the current user.
								service.SetCredentials(response.userCtx);
							} else {
								// The user already login match CouchDB 
							}
							deferred.resolve(response.userCtx.name);
						}
					},
					function(reason) {
						document.dispatchEvent(new Event("authentication:offline", reason));

						deferred.reject(reason);
					})
				.fail(function(exception) {
					var ev = new Event("bug");
					ev.from = "validateWhoIsLogin";
					ev.exception = exception;

					document.dispatchEvent(ev);
					deferred.reject("There is a problem, please Contact us");
				});
		}
	}

})();