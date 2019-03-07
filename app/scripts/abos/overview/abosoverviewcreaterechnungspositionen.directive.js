'use strict';

angular
  .module('openolitor-admin')
  .directive('ooAbosOverviewCreateRechnungsPositionen', [
    function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          aboIds: '=',
          onClose: '&',
          filterQuery: '=',
          aboType: '='
        },
        transclude: false,
        templateUrl:
          'scripts/abos/overview/abosoverviewcreaterechnungspositionen.html',
        controller: 'AbosOverviewCreateRechnungsPositionenController'
      };
    }
  ]);
