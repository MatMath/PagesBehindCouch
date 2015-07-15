/* global console */
/*
======== A Handy Little Jasmine Reference ========
inspired by  https://github.com/pivotal/jasmine/wiki/Matchers
Spec matchers:
  expect(x).toEqual(y); compares objects or primitives x and y and passes if they are equivalent
  expect(x).toBe(y); compares objects or primitives x and y and passes if they are the same object
  expect(x).toMatch(pattern); compares x to string or regular expression pattern and passes if they match
  expect(x).toBeDefined(); passes if x is not undefined
  expect(x).toBeUndefined(); passes if x is undefined
  expect(x).toBeNull(); passes if x is null
  expect(x).toBeTruthy(); passes if x evaluates to true
  expect(x).toBeFalsy(); passes if x evaluates to false
  expect(x).toContain(y); passes if array or string x contains y
  expect(x).toBeLessThan(y); passes if x is less than y
  expect(x).toBeGreaterThan(y); passes if x is greater than y
  expect(x).toBeCloseTo; matcher is for precision math comparison
  expect(x).toThrow; matcher is for testing if a function throws an exception
  expect(x).toThrowError; matcher is for testing a specific thrown exception
  expect(function(){fn();}).toThrow(e); passes if function fn throws exception e when executed
  Every matcher's criteria can be inverted by prepending .not:
  expect(x).not.toEqual(y); compares objects or primitives x and y and passes if they are not equivalent
  Custom matchers help to document the intent of your specs, and can help to remove code duplication in your specs.
  beforeEach(function() {
    this.addMatchers({
      toBeLessThan: function(expected) {
        var actual = this.actual;
        var notText = this.isNot ? " not" : "";
        this.message = function () {
          return "Expected " + actual + notText + " to be less than " + expected;
        }
        return actual < expected;
      }
    });
  });
*/

(function() {
	'use strict';

	describe('Test to print out jasmine version', function() {
		it('prints jasmine version', function() {
			console.log('jasmine-version:' + jasmine.version);
		});
	});


	describe('someFunctionHere', function() {

		beforeEach(module('pagesBehindCouch'));

		var $controller, vm;

		beforeEach(inject(function(_$controller_) {
			// The injector unwraps the underscores (_) from around the parameter names when matching
			$controller = _$controller_;
		}));

		describe('TestinTheController', function() {
			var $scope;

			beforeEach(function() {
				$scope = {};
				vm = $controller('MainController', {
					$scope: $scope
				});
			});

			it('Should validate that all function and Variable are there', function() {
				// Private function cannot be tested
				expect(vm).toBeDefined();
				expect(vm.stagesFromTemplate).toBeDefined();
				expect(vm.inspectionInfo).toBeDefined();
				expect(vm.splitIntoStage).toBeDefined();
			});

			it('Test the function showTheUserADashboardRelativizedToThem', function() {
				var inspection = {
					"id": "IDOfTheDocs",
					"value": {
						"inspectionStage_label": "Pre Shipment",
						"id": "NotTheIDOfTheDocs",
						"has_sku_params": true,
						"sku_name": "Sku Name",
						"sku_number": "Sku Number",
						"sku_style": "Sku Style",
						"sku_description": "Some Sku Description",
						"sku_serial_no": "Some Serial Number",
						"sku_date_forecasted_inspection": "Forcasted Inspection",
						"inspection_location": "Inspection location",
						"inspection_location_gps": "28, 125",
						"assignment_id": "123456",
						"assignment_date_first_retrieved": "2015-05-06",
						"purchaseOrder_number": "654321",
						"purchaseOrder_order_date": "2015-05-07",
						"inspection_completed_date": "2015-05-08",
						"sampleSize": 5,
						"lotSize": 1600,
						"qtyToInspect": 1500,
						"shipped_to_location": "Shipped to Location",
						"starred": "",
						"actionRequired": "",
						"status": "New",
						"statusColor": "new",
						"conclusion": "",
						"conclusionColor": "",
						"supplier": "Factory"
					}
				};
				var stage = {
					"fields_to_show_an_inspector_on_dashboard": [
						"sku_name",
						"Date Ordered:",
						"purchaseOrder_order_date",
						"lot size:",
						"lotSize",
						"PO:",
						"purchaseOrder_number",
						"Qty to Inspect:",
						"qtyToInspect",
						"Shipped to:",
						"shipped_to_location",
						"Scheduled Date:",
						"assignment_id",
						"status"
					]
				};
				var returnedValue = vm.showTheUserADashboardRelativizedToThem(inspection, stage);
				expect(vm.showTheUserADashboardRelativizedToThem).toBeDefined();
				expect(typeof vm.showTheUserADashboardRelativizedToThem === 'function').toBeTruthy();
				expect(returnedValue.id).toEqual("IDOfTheDocs");
				expect(returnedValue.has_sku_params).toBeTruthy();
				expect(returnedValue.string_to_show_user).toBeDefined();
				expect(returnedValue.string_to_show_user).toContain("Sku Name"); 
				expect(returnedValue.string_to_show_user).toContain(1500);  //testing the value attached
				expect(returnedValue.string_to_show_user).toContain("Shipped to:");  //testing the name string
				expect(returnedValue.statusColor).toEqual("new");
				expect(returnedValue.starred).toBeDefined();
				expect(returnedValue.actionRequired).toBeDefined();
			});

			it('Test the function setInspectionInRightCathegory', function() {
				expect(vm.setInspectionInRightCathegory).toBeDefined();
				expect(typeof vm.setInspectionInRightCathegory === 'function').toBeTruthy();
			});

			it('Should receive info from CouchDB Mapreduce', function() {
				expect(true).toBeTruthy();
			});

			it('Should display in the HTML the result of the injected mapreduce', function() {
				expect(true).toBeTruthy();
			});

		});
	});

})();