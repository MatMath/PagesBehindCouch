(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.directive('headerView', headerView);

	/** @ngInject */
	function headerView() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/clientSpecificCode/client2/headerView.html',
			controller: 'HeaderController',
			controllerAs: 'headCtrl',
			bindToController: true
		};

		return directive;
	}

})();