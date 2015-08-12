/* global document, Q, Event,  console */
(function() {
	'use strict';

	angular
		.module('pagesBehindCouch')
		.controller('MainController', MainController);

	/** @ngInject */
	function MainController(couchdb, $scope, $rootScope, $location, AuthenticationService) {
		//Body here
		var vm = this;
		vm.setInspectionInRightCathegory = setInspectionInRightCathegory; //Exposing the function only to be able to test it
		vm.showTheUserADashboardRelativizedToThem = showTheUserADashboardRelativizedToThem; //Exposing the function only to be able to test it
		vm.validateWhoIsLogin = validateWhoIsLogin;
		vm.stagesFromTemplate = "";
		vm.inspectionInfo = "";
		vm.splitIntoStage = {};

		(function initController() {
			// Validate if the user is still login and have access to his DB. 
			validateWhoIsLogin();
		})();

		function validateWhoIsLogin() {
			// At opening, fetch all user that are already login in the system (DB already downloaded in couchdb)

			var deferred = Q.defer();
			AuthenticationService.checkTheSession()
				.then(
					function(response) {
						deferred.resolve(response);
						if (!response.userCtx || !response.userCtx.name) {
							if (!$rootScope.globals.currentUser || !$rootScope.globals.currentUser.name) {
								// User is not login and is not set in the global variable, so redirect to the login page.
								$location.path('/login');
								$scope.$apply();
								return;
							} else {
								// Try to re-login the user with his know username. 
								document.dispatchEvent(new Event("authentication:reAuthenticate", $rootScope.globals.currentUser.name));
							}
							deferred.reject("user is not login");
						} else {
							if (!$rootScope.globals.currentUser || $rootScope.globals.currentUser.name !== response.userCtx.name) {
								// User in Global var and CouchDB do not match
								// Update the Global with the current user.
								AuthenticationService.SetCredentials(response.userCtx);
							} else {
								// The user already login match CouchDB 
							}
							deferred.resolve(response.userCtx.name);
							getStagesFromTemplate();
						}
						$scope.$digest();
					},
					function(reason) {
						document.dispatchEvent(new Event("authentication:offline", reason));
						deferred.reject(reason);
					})
				.fail(function(exception) {
					var ev = new Event("bug");
					ev.from = "validateWhoIsLogin";
					ev.exception = exception;

					document.dispatchEvent(ev);
					deferred.reject("There is a problem, please Contact us");
				});
		}

		function getStagesFromTemplate() {
			// All cathegory 
			var deferred = Q.defer();
			couchdb.getCouchDBInfo('getStagesFromTemplate')
				.then(
					function(response) {
						deferred.resolve(response);
						vm.stagesFromTemplate = response;
						// Step 1, create all the possible stages by pushing the ID of this one on top. 
						for (var stage = 0; stage < vm.stagesFromTemplate.rows.length; stage++) {
							var stageID = vm.stagesFromTemplate.rows[stage].id;
							vm.splitIntoStage[stageID] = [vm.stagesFromTemplate.rows[stage]];
						}
						// then Fetch all inspections of them and push them in the right location.
						getCouchDBInspectionInfo(vm.stagesFromTemplate);
						$scope.$digest();
					},
					function(reason) {
						deferred.reject(reason);
						vm.stagesFromTemplate = reason;
						$scope.$digest();
					})
				.fail(function(exception) {
					console.warn("there was an exception ", exception, exception.stack);
				});
		}

		function getCouchDBInspectionInfo(possibleCathegory) {
			// All inspection assigned to the user.
			var deferred = Q.defer();
			couchdb.getCouchDBInfo('byStage2')
				.then(
					function(response) {
						deferred.resolve(response);
						vm.inspectionInfo = response;
						setInspectionInRightCathegory(vm.inspectionInfo.rows, possibleCathegory.rows);
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

		function setInspectionInRightCathegory(inspections, possibleCathegory) {
			if (inspections && possibleCathegory) {
				for (var inspection = 0; inspection < inspections.length; inspection++) {
					var inspectionID = inspections[inspection].value.inspectionStage.UUID;

					// Find text to enter and push it to the Respective stage
					var ItemToPush = showTheUserADashboardRelativizedToThem(inspections[inspection], vm.splitIntoStage[inspectionID][0].value);
					if (ItemToPush) {
						vm.splitIntoStage[inspectionID].push(ItemToPush);
					}

				}
			} else {
				// Need to relaunch the Stage and assignment fetching function???
				// alert("Did not find any inspection to display, try reloading");
			}

			// loading = false;
		}

		function showTheUserADashboardRelativizedToThem(inspection, stage) {
			if (!inspection || !stage) {
				return;
			}

			var stringToShowTheUser = "";
			var whatToShowTheUser = stage.fields_to_show_an_inspector_on_dashboard;


			var previousFieldLabel = "";
			for (var field in whatToShowTheUser) {
				if (whatToShowTheUser[field].indexOf(":") >= 0) {
					previousFieldLabel = whatToShowTheUser[field];
				} else {
					var stringToShow = inspection.value[whatToShowTheUser[field]];
					if (stringToShow) {

						// Handle date formatting
						if (typeof stringToShow !== 'number') {
							if (stringToShow.indexOf("0000-00-00") > -1) {
								stringToShow = "";
							}
							stringToShow.replace("00:00:00", "");
						}
						/*
						 * This makes the 2013-01-02 into a localized date form with
						 * the day of the week
						 */
						if (whatToShowTheUser[field].indexOf("date") > -1 && Date.parse(stringToShow)) {
							var date = new Date(stringToShow);
							stringToShow = date.toDateString();
						}

						// Concatenate info; don't display empty fields
						if (stringToShow === "") {
							// do nothing
						} else {
							stringToShowTheUser = stringToShowTheUser + "  " + previousFieldLabel + " " + stringToShow;

							if (field < whatToShowTheUser.length - 1) {
								stringToShowTheUser = stringToShowTheUser + ", ";
							}
						}
						previousFieldLabel = "";
					}
				}
			}

			return {
				"id": inspection.id,
				"has_sku_params": inspection.value.has_sku_params,
				"string_to_show_user": stringToShowTheUser,
				"statusColor": inspection.value.statusColor,
				"conclusionColor": inspection.value.conclusionColor,
				"starred": inspection.value.starred,
				"actionRequired": inspection.value.actionRequired
			};
		}

	}
})();