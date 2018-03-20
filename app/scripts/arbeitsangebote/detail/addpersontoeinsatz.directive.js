'use strict';

angular.module('openolitor-admin').directive('ooAddPersonToEinsatz', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: '/scripts/arbeitsangebote/detail/addpersontoeinsatz.html',
      controller: 'ArbeitsangeboteDetailController'
    };
  }
]);
