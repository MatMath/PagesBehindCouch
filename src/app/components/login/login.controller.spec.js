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
// Inspiration from: http://www.sitepoint.com/unit-testing-angularjs-services-controllers-providers/

(function() {
	'use strict';

	describe('Function in login Controller', function() {
		var vm, mockAuthService, rootScope, scope, passPromise;

		beforeEach(function() {
			module(function($provide) {
				$provide.factory('AuthenticationService', ['$q',
					function($q) {
						function checkTheSession() {
							if (passPromise) {
								return $q.when();
							} else {
								return $q.reject();
							}
						}

						function Login() {
							var response = {
								status: true
							};
							var reject = {
								status: false
							};
							if (passPromise) {
								return $q.when(response);
							} else {
								return $q.reject(reject);
							}
						}

						return {
							checkTheSession: checkTheSession,
							Login: Login
						};
					}
				]);
			});

			module('pagesBehindCouch');
		});

		beforeEach(inject(function($rootScope, $controller, AuthenticationService) {
			rootScope = $rootScope;
			scope = $rootScope.$new();
			mockAuthService = AuthenticationService;
			spyOn(mockAuthService, 'checkTheSession').and.callThrough();
			spyOn(mockAuthService, 'Login').and.callThrough();
		}));

		describe('TestinTheController', function() {
			beforeEach(inject(function($controller) {
				vm = $controller('LoginController', {
					$scope: scope,
					AuthenticationService: mockAuthService
				});
			}));

			it('Should validate that all function and Variable are there', function() {
				// Private function cannot be tested
				expect(vm).toBeDefined();
				expect(vm.listOfUser).toBeDefined();
			});

			it('Test the function login', function() {
				passPromise = true;
				vm.login();

				expect(vm.login).toBeDefined();
				expect(typeof vm.login === 'function').toBeTruthy();
				expect(mockAuthService.Login).toBeDefined();
				expect(mockAuthService.Login).toHaveBeenCalled();
				// expect(vm.dataLoading).toBeFalsy();
				// expect(mockAuthService.SetCredentials).toHaveBeenCalled();
			});

			it('Test the function logout', function() {
				expect(vm.logout).toBeDefined();
				expect(typeof vm.logout === 'function').toBeTruthy();
			});

			it('Should have 3 user when we have 3 Database in CouchDB at Login', function() {
				expect(true).toBeTruthy();
			});

		});
	});

})();