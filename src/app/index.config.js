(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.config(config);

	/** @ngInject */
	function config($logProvider) {
		// Enable log
		$logProvider.debugEnabled(true);
	}

})();