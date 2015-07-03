/* global Q, CORS */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.factory('AuthenticationService', AuthenticationService);

	AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService'];

	function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService) {
		var service = {};

		service.Login = Login;
		service.SetCredentials = SetCredentials;
		service.ClearCredentials = ClearCredentials;

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

		function SetCredentials(username, password, extraInfo) {
			// FIXME: Add Base64 encoding from Browser directly. https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa
			// var authdata = Base64.encode(username + ':' + password);
			var authdata = username + ':' + password;

			$rootScope.globals = {
				currentUser: {
					username: username,
					authdata: authdata,
					extra: extraInfo
				}
			};

			$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
			$cookies.put('globals', $rootScope.globals);
		}

		function ClearCredentials() {
			$rootScope.globals = {};
			$cookies.remove('globals');
			$http.defaults.headers.common.Authorization = 'Basic ';
		}
	}

})();