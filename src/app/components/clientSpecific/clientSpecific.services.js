/* global CORS */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.service('clientSpecific', clientSpecific);

	/** @ngInject */
	function clientSpecific(AuthenticationService) {
		//Body here
		var vm = this;
		vm.blankinspectionForm = blankinspectionForm;

		function blankinspectionForm () {
			// body...
		}
		
	}
})();