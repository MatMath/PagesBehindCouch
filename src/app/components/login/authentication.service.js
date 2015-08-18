/* global CORS */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.factory('AuthenticationService', AuthenticationService);

	AuthenticationService.$inject = ['$http', '$cookies', '$rootScope'];

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
			'updateUserPreferences': updateUserPreferences
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
				databaseName: 'tabletbackup-'+extraInfo.name+'-localhost'
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

	}

})();