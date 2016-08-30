'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('KundenDetailService', ['$http', 'API_URL',
    function($http, API_URL) {
      var service = {
        deletePerson: deletePerson,
        disableLogin: disableLogin,
        enableLogin: enableLogin,
        sendEinladung: sendEinladung
      };

      return service;

      function deletePerson(kundeId, personId) {
        return $http.delete(API_URL + 'kunden/' + kundeId + '/personen/' + personId);
      };

      function disableLogin(kundeId, personId) {
        return $http.post(API_URL + 'kunden/' + kundeId + '/personen/' + personId + '/aktionen/logindeaktivieren');
      };

      function enableLogin(kundeId, personId) {
        return $http.post(API_URL + 'kunden/' + kundeId + '/personen/' + personId + '/aktionen/loginaktivieren');
      };

      function sendEinladung(kundeId, personId) {
        return $http.post(API_URL + 'kunden/' + kundeId + '/personen/' + personId + '/aktionen/einladungsenden');
      };
    }
  ]);
