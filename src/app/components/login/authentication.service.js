/* global CORS, document, Q, Event */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.factory('AuthenticationService', AuthenticationService);

	/** @ngInject */
	function AuthenticationService($http, $cookies, $rootScope) {
		var service = {
			'ClearCredentials': ClearCredentials,
			'getMapReduceLocation': getMapReduceLocation,
			'getBasicUrl': getBasicUrl,
			'getAllLocalDB': getAllLocalDB,
			'checkTheSession': checkTheSession,
			'getCurrentDBname': getCurrentDBname,
			'Login': Login,
			'logout': logout,
			'SetCredentials': SetCredentials,
			'getUserPreferencesLocation': getUserPreferencesLocation,
			'updateUserPreferences': updateUserPreferences,
			'validateWhoIsLogin': validateWhoIsLogin
		};

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
			// This is the Data that is inside the session return value. 
			$rootScope.globals = {
				currentUser: extraInfo,
				databaseName: 'tabletbackup-' + extraInfo.name + '-localhost'
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
			return service.getBasicUrl() + service.getCurrentDBname() + '/_design/pages/_view/';
		}

		function getUserPreferencesLocation() {
			return service.getBasicUrl() + service.getCurrentDBname() + '/user_preferences/';
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

		function getCurrentDBname() {
			return $rootScope.globals.databaseName;
		}

		function updateUserPreferences(preferences) {
			if (preferences) {
				$rootScope.userPreferences = preferences;
			}
		}

		function validateWhoIsLogin(scope) {
			// At opening, fetch all user that are already login in the system (DB already downloaded in couchdb)

			var deferred = Q.defer();
			service.checkTheSession()
				.then(
					function(response) {
						deferred.resolve(response);
						if (!response.userCtx || !response.userCtx.name) {
							if (!$rootScope.globals.currentUser || !$rootScope.globals.currentUser.name) {
								// User is not login and is not set in the global variable, so redirect to the login page.
								document.dispatchEvent(new Event("authentication:redirectToLogin", $rootScope.globals.currentUser.name));
								scope.$apply();
								return;
							} else {
								// Try to re-login the user with his know username. 
								document.dispatchEvent(new Event("authentication:reAuthenticate", $rootScope.globals.currentUser.name));
							}
							deferred.reject("user is not login");
						} else {
							if (!$rootScope.globals.currentUser || $rootScope.globals.currentUser.name !== response.userCtx.name) {
								// User in Global var and CouchDB do not match
								// Update the Global with the current user.
								service.SetCredentials(response.userCtx);
							} else {
								// The user already login match CouchDB
							}
							deferred.resolve(response.userCtx.name);
							// Fetch latest CouchDB Data.
							document.dispatchEvent(new Event("authentication:success", $rootScope.globals.currentUser.name));
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