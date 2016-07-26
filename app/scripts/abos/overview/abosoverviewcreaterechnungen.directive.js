'use strict';

angular.module('openolitor-admin').directive('ooAbosOverviewCreateRechnungen', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        aboIds: '=',
        onClose: '&'
      },
      transclude: false,
      templateUrl: 'scripts/abos/overview/abosoverviewcreaterechnungen.html',
      controller: 'AbosOverviewCreateRechnungenController'
    };
  }
]);
