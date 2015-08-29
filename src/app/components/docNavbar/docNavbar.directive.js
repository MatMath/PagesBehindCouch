(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.directive('docNavbar', docNavbar);

	/** @ngInject */
	function docNavbar() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/components/docNavbar/docNavbar.html',
			controller: 'docNavbarCtrl',
			controllerAs: 'docNavbarCtrl',
			bindToController: true
		};
		return directive;
	}

})();