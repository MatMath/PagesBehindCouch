(function() {
  'use strict';

  angular
    .module('pagesBehindCouch')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController'
      })
      .state('login', {
        url: '/about',
        templateUrl: 'app/components/login/login-partial.html',
        controller: 'MainController'
      })
      .state('notification', {
        url: '/notification',
        templateUrl: 'app/components/notification/notification-partial.html',
        controller: 'MainController'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
