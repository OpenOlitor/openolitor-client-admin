'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('AbosOverviewService', ['$http', 'appConfig',
    function($http, appConfig) {

      function createAnzahlLieferungenRechnungsPositionen(rechnungsPositionCreate) {
        return $http.post(appConfig.get().API_URL +
          'abos/aktionen/anzahllieferungenrechnungspositionen',
          rechnungsPositionCreate);
      }

      function createBisGuthabenRechnungsPositionen(rechnungsPositionCreate) {
        return $http.post(appConfig.get().API_URL + 'abos/aktionen/bisguthabenrechnungspositionen',
          rechnungsPositionCreate);
      }

      var service = {
        createAnzahlLieferungenRechnungsPositionen: createAnzahlLieferungenRechnungsPositionen,
        createBisGuthabenRechnungsPositionen: createBisGuthabenRechnungsPositionen
      };

      return service;
    }
  ]);
