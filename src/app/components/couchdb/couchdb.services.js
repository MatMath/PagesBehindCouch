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
		vm.getAllLocalDB = getAllLocalDB;

		function getCouchDBInfo(mapReduce) {
			if (mapReduce) {
				var url = AuthenticationService.getMapReduceLocation() + mapReduce;
				return CORS.makeCORSRequest({
					url: url,
					method: "GET"
				});
			}
		}

		function getAllLocalDB() {
			var url = AuthenticationService.getBasicUrl() + '_all_dbs';
			// this url should work on all CouchDB.
			return CORS.makeCORSRequest({
				url: url,
				method: "GET"
			});
		}
	}
})();