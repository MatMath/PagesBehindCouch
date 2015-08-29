(function() {
	'use strict';

	angular
		.module('client')
		.directive('docSequenceDisplay', docSequenceDisplay)
		.directive('headerView', headerView)
		.directive('middleView', middleView)
		.directive('footerView', footerView);

	/** @ngInject */
	function headerView() {
		// Shoudl have it's own Template location fetch from the JSON
		var directive = {
			restrict: 'E',
			templateUrl: 'app/currentClient/header.html',
			controller: 'HeaderController',
			controllerAs: 'headCtrl',
			bindToController: true
		};
		return directive;
	}

	function middleView() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/currentClient/middle.html',
			controller: 'HeaderController',
			controllerAs: 'headCtrl',
			bindToController: true
		};
		return directive;
	}

	function footerView() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/currentClient/footer.html',
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
			template: '<header-view></header-view><middle-view></middle-view><footer-view></footer-view>',
			controller: 'HeaderController',
			controllerAs: 'headCtrl',
			bindToController: true
		};
		return directive;
	}

})();