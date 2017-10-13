'use strict';

angular.module('openolitor-admin').directive('ooRechnungsPositionenOverviewCreateRechnungen', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        rechnungsPositionen: '=',
        onClose: '&'
      },
      transclude: false,
      templateUrl: 'scripts/rechnungspositionen/overview/rechnungspositionenoverviewcreaterechnungen.html',
      controller: 'RechnungsPositionenOverviewCreateRechnungenController'
    };
  }
]);
