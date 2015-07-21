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
		service.SetCredentials = SetCredentials;
		service.ClearCredentials = ClearCredentials;
		service.getMapReduceLocation = getMapReduceLocation;
		service.getBasicUrl = getBasicUrl;
		service.getAllLocalDB = getAllLocalDB;
		service.whoIsLogin = whoIsLogin;

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

		function getBasicUrl(){
			return	'https://localhost:6984/';
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

		function whoIsLogin(user) {
			// At opening, fetch all user that are already login in the system (DB already downloaded in couchdb)

			var deferred = Q.defer();
				checkTheSession()
				.then(
					function(response) {
						deferred.resolve(response);
						if (!response.userCtx || !response.userCtx.name) {
							user.name = null;
							deferred.reject("user is not login");
						} else {
							user.name = response.userCtx.name;
							deferred.resolve(response.userCtx.name);
						}
					},
					function(reason) {
						deferred.reject(reason);
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
					deferred.reject("There is a problem, please Contact us");
				});
		}
	}

})();