/* global alert */
(function() {
	'use strict';
	// If client X need extra dependency to be injected inside it, we need to have them already injected in the main index.module
	angular
		.module('client3', [])
		.controller('HeaderController', HeaderController);

	/** @ngInject */
	function HeaderController() {
		//Body here
		var vm = this;
		vm.clickEvent = clickEvent;

		function clickEvent() {
			// body...
			alert("This is Client 3 Controller");
		}

	}
})();