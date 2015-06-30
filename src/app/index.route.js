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
				templateUrl: 'app/main/main.html',
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
			});

		$urlRouterProvider.otherwise('/');
	}

	run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];

	function run($rootScope, $location, $cookieStore, $http) {
		// keep user logged in after page refresh
		$rootScope.globals = $cookieStore.get('globals') || {};
		if ($rootScope.globals.currentUser) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
		}

		$rootScope.$on('$locationChangeStart', function(event, next, current) {
			// redirect to login page if not logged in and trying to access a restricted page
			var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
			var loggedIn = $rootScope.globals.currentUser;
			if (restrictedPage && !loggedIn) {
				$location.path('/login');
			}
		});
	}

})();