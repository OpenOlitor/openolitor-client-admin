'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('LieferantenAbrechnungenOverviewService', ['$http', 'API_URL',
    function($http, API_URL) {

      function alsAbgerechnetMarkieren(data) {
        return $http.post(API_URL +
          'lieferanten/bestellungen/aktionen/abgerechnet',
          data);
      }

      var service = {
        alsAbgerechnetMarkieren: alsAbgerechnetMarkieren
      };

      return service;
    }
  ]);
