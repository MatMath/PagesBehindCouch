(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('HeaderController', HeaderController);

	/** @ngInject */
	function HeaderController() {
		//Body here
		var vm = this;
		vm.clickEvent = clickEvent;

		function clickEvent () {
			// body...
			alert("This is Client 1 Controller");
		}
		
	}
})();