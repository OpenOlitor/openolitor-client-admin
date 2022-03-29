'use strict';

angular.module('openolitor-admin').directive('ooRechnungsPositionDetail', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        rechnungsPosition: '=',
        projekt: '='
      },
      transclude: true,
      templateUrl: 'scripts/rechnungspositionen/detail/rechnungspositionendetail.html',
      controller: 'RechnungsPositionDetailController'
    };
  }
]);
