'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('KundenDetailService', ['$http', 'appConfig',
    function($http, appConfig) {
      var service = {
        deletePerson: deletePerson,
        disableLogin: disableLogin,
        enableLogin: enableLogin,
        sendEinladung: sendEinladung,
        changeRolle: changeRolle
      };

      return service;

      function deletePerson(kundeId, personId) {
        return $http.delete(appConfig.get().API_URL + 'kunden/' + kundeId + '/personen/' + personId);
      };

      function disableLogin(kundeId, personId) {
        return $http.post(appConfig.get().API_URL + 'kunden/' + kundeId + '/personen/' + personId + '/aktionen/logindeaktivieren');
      };

      function enableLogin(kundeId, personId) {
        return $http.post(appConfig.get().API_URL + 'kunden/' + kundeId + '/personen/' + personId + '/aktionen/loginaktivieren');
      };

      function sendEinladung(kundeId, personId) {
        return $http.post(appConfig.get().API_URL + 'kunden/' + kundeId + '/personen/' + personId + '/aktionen/einladungsenden');
      };

      function changeRolle(kundeId, personId, rolle) {
        return $http.post(appConfig.get().API_URL + 'kunden/' + kundeId + '/personen/' + personId + '/aktionen/rollewechseln', '"' + rolle + '"');
      };
    }
  ]);
