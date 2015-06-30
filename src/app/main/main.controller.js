(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('MainController', MainController);

	/** @ngInject */
	function MainController() {
		//Body here
		var vm = this;
		vm.pleaseAlertMe2 = function() {
			console.log("PLEASE");
			alert("Common Tabarnack");
		};

	}
})();