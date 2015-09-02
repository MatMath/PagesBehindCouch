(function() {
  'use strict';

  angular
    .module('pagesBehindCouch')
    .directive('fallbackSrc', fallbackSrc);

  /** @ngInject */
  function fallbackSrc() {
    var fallbackSrcToReturn = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.fallbackSrc);
      });
    }
   };
   return fallbackSrcToReturn;
  }
})();