// translation.config.js
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.config(['$translateProvider', function ($translateProvider) {

		  $translateProvider.useStaticFilesLoader({
		   		prefix: 'app/languages/',
		   		suffix: '.json'
		   });
		 
		  $translateProvider.preferredLanguage('en');
		  $translateProvider.useLocalStorage();
		  $translateProvider.useSanitizeValueStrategy('escape');

		}]);
	

})();

