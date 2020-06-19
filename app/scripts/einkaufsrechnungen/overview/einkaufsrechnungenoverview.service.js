'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('EinkaufsrechnungenOverviewService', ['$http', 'appConfig',
    function($http, appConfig) {

      function alsAbgerechnetMarkieren(data) {
        return $http.post(appConfig.get().API_URL +
          'lieferanten/sammelbestellungen/aktionen/abgerechnet',
          data);
      }

      var service = {
        alsAbgerechnetMarkieren: alsAbgerechnetMarkieren
      };

      return service;
    }
  ]);
