'use strict';

/**
 */
angular.module('openolitor-admin').factory('ZusatzabosOverviewService', [
  '$http',
  'API_URL',
  function($http, API_URL) {
    function createAnzahlLieferungenRechnungsPositionen(
      rechnungsPositionCreate
    ) {
      return $http.post(
        API_URL + 'zusatzabos/aktionen/anzahllieferungenrechnungspositionen',
        rechnungsPositionCreate
      );
    }

    var service = {
      createAnzahlLieferungenRechnungsPositionen: createAnzahlLieferungenRechnungsPositionen
    };

    return service;
  }
]);
