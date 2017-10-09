'use strict';

angular.module('openolitor-admin').directive('ooBestellungDetail', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        bestellungId: '=',
        projekt: '=',
        onClose: '&'
      },
      transclude: false,
      templateUrl: 'scripts/einkaufsrechnungen/detail/bestellung.html',
      controller: 'BestellungDetailController'
    };
  }
]);
