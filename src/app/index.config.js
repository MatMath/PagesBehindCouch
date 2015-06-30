(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.config(config)
		.config(config2)
		.config(configCors);

	/** @ngInject */
	function config($logProvider) {
		// Enable log
		$logProvider.debugEnabled(true);
	}

	function config2($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			// Allow same origin resource loads.
			'self',
			// Allow loading from our assets domain.  Notice the difference between * and **.
			'https://localhost:6984/**',
			'https://corpusdev.lingsync.org/**'
		]);

	}

	function configCors($httpProvider) {
		// $httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}

})();