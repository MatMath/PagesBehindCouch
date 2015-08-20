/* global console */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('DocviewController', DocviewController);

	/** @ngInject */
	function DocviewController() {
		//Body here
		var vm = this;
		console.log("Loading the DocviewController");
	}
})();