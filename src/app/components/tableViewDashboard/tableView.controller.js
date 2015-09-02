/* global document, Q, console */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('tableviewController', tableviewController);

	/** @ngInject */
	function tableviewController(couchdb, $scope, $rootScope, $location, AuthenticationService) {
		//Body here
		var vm = this;
		vm.openThatDoc = openThatDoc;
		vm.getCouchDBInspectionInfo = getCouchDBInspectionInfo;
		vm.showIfInTheList = showIfInTheList;
		vm.removeFromTheList = removeFromTheList;
		vm.addToTheList = addToTheList;
		vm.moveitemDown = moveitemDown;
		vm.moveitemUp = moveitemUp;
		vm.saveNewUserPreferences = saveNewUserPreferences;
		vm.inspectionInfo = "";
		vm.allPossibleKey = [];
		vm.userDisplaySequence = [];
		vm.editPreferencesMode = false;
		vm.preferences = $rootScope.userPreferences;

		document.addEventListener("authentication:success", function() {
			// Since the user is Login, Access is Data.
			if ($rootScope.userPreferences && $rootScope.userPreferences.tableViewDisplaySequence) {
				vm.userDisplaySequence = $rootScope.userPreferences.tableViewDisplaySequence;
			} else {
				// Nothign in the user DB, so create generic one and at the save, it will get push into the CouchDB Preferences.
				vm.userDisplaySequence = ["starred","inspectionStage_label","purchaseOrder_number","sku_number","has_sku_params","qtyToInspect","assignment_id","status"];
			}
			getCouchDBInspectionInfo();
		});

		(function initController() {
			// Validate if the user is still login and have access to his DB. 
			AuthenticationService.validateWhoIsLogin($scope);
		})();

		function getCouchDBInspectionInfo() {
			// All inspection assigned to the user.
			var deferred = Q.defer();
			couchdb.getCouchDBInfo('byStage2')
				.then(
					function(response) {
						deferred.resolve(response);
						vm.inspectionInfo = response;
						if (response.rows[0]) {
							setTitleArray(response.rows[0].value);
						}
						$scope.$digest();
					},
					function(reason) {
						deferred.reject(reason);
						vm.inspectionInfo = reason;
						$scope.$digest();
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}

		function openThatDoc (UUID) {
			// Middle step Instead of opening the page directly in case we want to validate something before opening the Doc.
			if (!UUID) {
				return;
			}
			// Redirect the user to the DocView + That page should open + display that doc.
			$location.path('/docview/'+ UUID);
		}

		function setTitleArray (firstRowData) {
			console.log(firstRowData);
			for (var element in firstRowData) {
				vm.allPossibleKey.push(element);
			}
		}

		function showIfInTheList (item) {
			if (item && vm.userDisplaySequence.indexOf(item) > -1) {
				return true;
			}
		}
		
		function removeFromTheList (item) {
			if (item) {
				var itemIndex = vm.userDisplaySequence.indexOf(item);
				vm.userDisplaySequence.splice(itemIndex, 1);
			}
		}
		
		function addToTheList (item) {
			if (item) {
				vm.userDisplaySequence.push(item);
			}
		}

		function moveitemUp (index) {
			if (index && index !== 0) {
				// Step1, Remove the item from current position.
				// Step 2 add it to the other position (-1).
				vm.userDisplaySequence.splice(index - 1, 0, vm.userDisplaySequence.splice(index, 1)[0]);
			}
		}

		function moveitemDown (index) {
			if (index) {
				// Step1, Remove the item from current position.
				// Step 2 add it to the other position (+1).
				vm.userDisplaySequence.splice(index + 1, 0, vm.userDisplaySequence.splice(index, 1)[0]);
			}	
		}

		function saveNewUserPreferences() {
			var deferred2 = Q.defer();
			couchdb.getUserPreferences()
				.then(
					function(response) {
						deferred2.resolve(response);
						response.tableViewDisplaySequence = vm.userDisplaySequence;
						AuthenticationService.updateUserPreferences(response);
						couchdb.updateUserPreferences(response);
						vm.editPreferencesMode = false;
						$scope.$apply(); //Because Angular do not see it passing
					},
					function(reason) {
						deferred2.reject(reason);
						if (reason.error === "not_found") {
							// Preferences are missing, so Write new Generic one.
							var genericPreferences = {
								"_id": "user_preferences",
								"lang": "en",
								"tableViewDisplaySequence": vm.userDisplaySequence
							};
							AuthenticationService.updateUserPreferences(genericPreferences);
							couchdb.updateUserPreferences(genericPreferences);
						}
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}

	}
})();