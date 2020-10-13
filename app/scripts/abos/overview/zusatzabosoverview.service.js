'use strict';

/**
 */
angular.module('openolitor-admin').factory('ZusatzabosOverviewService', [
  '$http',
  'appConfig',
  function($http, appConfig) {
    function createAnzahlLieferungenRechnungsPositionen(
      rechnungsPositionCreate
    ) {
      return $http.post(
        appConfig.get().API_URL + 'zusatzabos/aktionen/anzahllieferungenrechnungspositionen',
        rechnungsPositionCreate
      );
    }

    var service = {
      createAnzahlLieferungenRechnungsPositionen: createAnzahlLieferungenRechnungsPositionen
    };

    return service;
  }
]);
