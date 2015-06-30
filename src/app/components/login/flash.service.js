(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.factory('FlashService', FlashService);

	FlashService.$inject = ['$rootScope'];

	function FlashService($rootScope) {
		var service = {};

		initService();


		function initService() {
			$rootScope.$on('$locationChangeStart', function() {
				clearFlashMessage();
			});

			function clearFlashMessage() {
				var flash = $rootScope.flash;
				if (flash) {
					if (!flash.keepAfterLocationChange) {
						delete $rootScope.flash;
					} else {
						// only keep for a single location change
						flash.keepAfterLocationChange = false;
					}
				}
			}
		}

		service.Success = function(message, keepAfterLocationChange) {
			$rootScope.flash = {
				message: message,
				type: 'success',
				keepAfterLocationChange: keepAfterLocationChange
			};
		};

		service.Error = function (message, keepAfterLocationChange) {
			$rootScope.flash = {
				message: message,
				type: 'error',
				keepAfterLocationChange: keepAfterLocationChange
			};
		};
		
		return service;
	}

})();