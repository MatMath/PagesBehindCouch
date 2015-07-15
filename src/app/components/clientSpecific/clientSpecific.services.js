(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.service('clientSpecific', clientSpecific);

	/** @ngInject */
	function clientSpecific() {
		//Body here
		var vm = this;
		vm.blankinspectionForm = blankinspectionForm;

		function blankinspectionForm () {
			// body...
		}
		
	}
})();