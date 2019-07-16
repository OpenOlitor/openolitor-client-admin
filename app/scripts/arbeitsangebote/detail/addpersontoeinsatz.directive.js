'use strict';

angular.module('openolitor-admin').directive('ooAddPersonToEinsatz', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: false,
      transclude: true,
      templateUrl: 'scripts/arbeitsangebote/detail/addpersontoeinsatz.html',
      controller: 'ArbeitsangeboteDetailController'
    };
  }
]);
