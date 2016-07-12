'use strict';

/**
 */
angular.module('openolitor')
  .factory('AbosOverviewService', ['$http', 'API_URL',
    function($http, API_URL) {
      var service = {
        createAnzahlLieferungenRechnungen: createAnzahlLieferungenRechnungen
      };

      return service;

      function createAnzahlLieferungenRechnungen(rechnungCreate) {
        return $http.post(API_URL + 'abos/aktionen/anzahllieferungenrechnungen',
          rechnungCreate);
      };
  }]);
