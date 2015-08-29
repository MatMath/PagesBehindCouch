(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.directive('globalNavbar', globalNavbar);

	/** @ngInject */
	function globalNavbar() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/components/navbar/navbar.html',
			controller: 'NavbarController',
			controllerAs: 'vm',
			bindToController: true
		};

		return directive;
	}

})();