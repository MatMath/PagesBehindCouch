(function() {
	'use strict';

	angular
		.module('client3')
		.directive('headerView', headerView);

	/** @ngInject */
	function headerView() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/clientSpecificCode/client3/headerView.html',
			controller: 'HeaderController',
			controllerAs: 'headCtrl',
			bindToController: true
		};

		return directive;
	}

})();