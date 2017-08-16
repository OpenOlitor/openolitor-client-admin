'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('AbosOverviewService', ['$http', 'API_URL',
    function($http, API_URL) {

      function createAnzahlLieferungenRechnungsPositionen(rechnungsPositionCreate) {
        return $http.post(API_URL +
          'abos/aktionen/anzahllieferungenrechnungspositionen',
          rechnungsPositionCreate);
      }

      function createBisGuthabenRechnungsPositionen(rechnungsPositionCreate) {
        return $http.post(API_URL + 'abos/aktionen/bisguthabenrechnungspositionen',
          rechnungsPositionCreate);
      }

      var service = {
        createAnzahlLieferungenRechnungsPositionen: createAnzahlLieferungenRechnungsPositionen,
        createBisGuthabenRechnungsPositionen: createBisGuthabenRechnungsPositionen
      };

      return service;
    }
  ]);

