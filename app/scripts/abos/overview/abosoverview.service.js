'use strict';

/**
 */
angular.module('openolitor')
  .factory('AbosOverviewService', ['$http', 'API_URL',
    function($http, API_URL) {
      var service = {
        createAnzahlLieferungenRechnungen: createAnzahlLieferungenRechnungen,
        createBisGuthabenRechnungen: createBisGuthabenRechnungen
      };

      return service;

      function createAnzahlLieferungenRechnungen(rechnungCreate) {
        return $http.post(API_URL + 'abos/aktionen/anzahllieferungenrechnungen',
          rechnungCreate);
      };

      function createBisGuthabenRechnungen(rechnungCreate) {
        return $http.post(API_URL + 'abos/aktionen/bisguthabenrechnungen',
          rechnungCreate);
      };
  }]);
