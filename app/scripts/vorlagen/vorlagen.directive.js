'use strict';

angular.module('openolitor-admin').directive('ooVorlagen', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        vorlagen: '=',
        typ: '='
      },
      transclude: false,
      templateUrl: 'scripts/vorlagen/vorlagen.html',
      controller: 'VorlagenController'
    };
  }
]);
