(function() {
	'use strict';

	angular
		.module('client')
		.directive('docSequenceDisplay', docSequenceDisplay)
		.directive('headerView', headerView);

	/** @ngInject */
	function headerView() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/currentClient/headerView.html',
			controller: 'HeaderController',
			controllerAs: 'headCtrl',
			bindToController: true
		};
		return directive;
	}

	function docSequenceDisplay() {
		// In there we could check the JSON of the Doc and each doc could tell us the order to display itself otherwise it will be the Standars display.
		var directive = {
			restrict: 'E',
			template: '<header-view></header-view>',
			controller: 'HeaderController',
			controllerAs: 'headCtrl',
			bindToController: true
		};
		return directive;
	}

})();