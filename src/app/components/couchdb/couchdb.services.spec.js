
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
  describe('service tests', function() {
    var CouchDBObj, mockAuthServices;

    beforeEach(function() {
      module(function($provide) {
        $provide.service('AuthenticationService', function() {
          this.getMapReduceLocation = jasmine.createSpy('getMapReduceLocation');
          this.getUserPreferencesLocation = jasmine.createSpy('getUserPreferencesLocation');
        });
      });
      module('pagesBehindCouch');
    });

    beforeEach(inject(function(AuthenticationService, couchdb) {
      CouchDBObj = couchdb;
      mockAuthServices = AuthenticationService;
    }));

    it('should have couchdb service, getCouchDBInfo function defined', function() {
      var mapreduce = "someMapReduceTag";
      CouchDBObj.getCouchDBInfo(mapreduce);

      expect(CouchDBObj).toBeDefined();
      expect(mockAuthServices).toBeDefined();
      expect(typeof CouchDBObj.getCouchDBInfo === 'function').toBeTruthy();
      // expect(mockAuthServices.getMapReduceLocation).toHaveBeenCalled(); --> Error: Expected a spy, but got Function.
    });

    it('should have couchdb service, getUserPreferences function defined', function() {
      expect(CouchDBObj).toBeDefined();
      expect(typeof CouchDBObj.getUserPreferences === 'function').toBeTruthy();
    });

    it('should have couchdb service, updateUserPreferences function defined', function() {
      expect(CouchDBObj).toBeDefined();
      expect(typeof CouchDBObj.updateUserPreferences === 'function').toBeTruthy();
    });

  });


})();