'use strict';

angular.module('openolitor').directive('ooAbosOverviewCreateRechnungen', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        aboIds: '='
      },
      transclude: true,
      templateUrl: 'scripts/abos/overview/abosoverviewcreaterechnungen.html',
      controller: 'AbosOverviewCreateRechnungenController'
    };
  }
]);
