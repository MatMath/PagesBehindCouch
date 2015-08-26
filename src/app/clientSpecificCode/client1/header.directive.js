(function() {
	'use strict';

	angular
		.module('client1')
		.directive('headerView', headerView);

	/** @ngInject */
	function headerView() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/clientSpecificCode/client1/headerView.html',
			controller: 'HeaderController',
			controllerAs: 'headCtrl',
			bindToController: true
		};

		return directive;
	}

})();