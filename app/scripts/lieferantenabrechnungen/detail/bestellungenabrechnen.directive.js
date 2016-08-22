'use strict';

angular.module('openolitor-admin').directive('ooBestellungenAbrechnen', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        bestellungIds: '=',
        onClose: '&'
      },
      transclude: false,
      templateUrl: 'scripts/lieferantenabrechnungen/detail/bestellungenabrechnen.html',
      controller: 'BestellungenAbrechnenController'
    };
  }
]);
