/* global document, prompt, console */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.config(routeConfig)
		.run(run);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'app/components/mainDashboard/main.html',
				controller: 'MainController',
				controllerAs: 'mainCtrl'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'app/components/login/login-partial.html',
				controller: 'LoginController',
				controllerAs: 'loginCtr'
			})
			.state('notification', {
				url: '/notification',
				templateUrl: 'app/components/notification/notification-partial.html',
				controller: 'NotificationController',
				controllerAs: 'NotCtrl'
			})
			.state('docview', {
				url: '/docview',
				templateUrl: 'app/components/docview/docview-partial.html',
				controller: 'DocviewController',
				controllerAs: 'docviewCtrl'
			});

		$urlRouterProvider.otherwise('/');
	}

	run.$inject = ['$rootScope', '$location', '$cookies', '$http'];

	function run($rootScope, $location, $cookies, $http) {
		// keep user logged in after page refresh
		$rootScope.globals = $cookies.get('globals') || {};
		if ($rootScope.globals.currentUser) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
		}

		document.addEventListener('authentication:reAuthenticate', function(user) {
			prompt("Please enter your password again" + user.name); // Make a cure Prompt here

		});

		document.addEventListener('authentication:offline', function(user) {
			// CouchDB is not responsive
			console.log(user);
		});

		document.addEventListener('bug', function(excep) {
			// Do Something here like send notification to the Dev Team
			console.warn("there was an excep in:" + excep.from, excep);
		});
	}

})();