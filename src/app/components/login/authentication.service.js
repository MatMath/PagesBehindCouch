/* global CORS */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.factory('AuthenticationService', AuthenticationService);

	AuthenticationService.$inject = ['$http', '$cookies', '$rootScope'];

	function AuthenticationService($http, $cookies, $rootScope) {
		var service = {};

		service.Login = Login;
		service.logout = logout;
		service.SetCredentials = SetCredentials;
		service.ClearCredentials = ClearCredentials;
		service.getMapReduceLocation = getMapReduceLocation;
		service.getBasicUrl = getBasicUrl;
		service.getAllLocalDB = getAllLocalDB;
		service.checkTheSession = checkTheSession;

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

	}

})();