(function() {
  'use strict';

  angular
    .module('pagesBehindCouch')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
