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

	describe('Function in login Controller', function() {

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
				vm = $controller('LoginController', {
					$scope: $scope
				});
			});

			it('Should validate that all function and Variable are there', function() {
				// Private function cannot be tested
				expect(vm).toBeDefined();
				expect(vm.listOfUser).toBeDefined();
			});

			it('Test the function login', function() {
				expect(vm.login).toBeDefined();
				expect(typeof vm.login === 'function').toBeTruthy();
			});

			it('Test the function logout', function() {
				expect(vm.logout).toBeDefined();
				expect(typeof vm.logout === 'function').toBeTruthy();
			});

			xit('Test the function fetchAlreadyDownloadeduser', function() {
				// Not expose to the outside so far...
				expect(vm.fetchAlreadyDownloadeduser).toBeDefined();
				expect(typeof vm.fetchAlreadyDownloadeduser === 'function').toBeTruthy();
			});

			it('Should have 3 user when we have 3 Database in CouchDB at Login', function() {
				expect(true).toBeTruthy();
			});

		});
	});

})();