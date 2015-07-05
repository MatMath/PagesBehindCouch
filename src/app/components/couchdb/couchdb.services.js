/* global CORS */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.service('couchdb', couchdb);

	couchdb.$inject = ['AuthenticationService'];
	/** @ngInject */
	function couchdb(AuthenticationService) {
		//Body here
		var vm = this;
		vm.getCouchDBInfo = getCouchDBInfo;

		function getCouchDBInfo(mapReduce) {
			if (mapReduce) {
				var url = AuthenticationService.getMapReduceLocation() + mapReduce;
				return CORS.makeCORSRequest({
					url: url,
					method: "GET"
				});
			}
		}
	}
})();