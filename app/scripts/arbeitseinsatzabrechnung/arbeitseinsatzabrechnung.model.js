'use strict';

/**
 */
angular.module('openolitor-admin').factory('ArbeitseinsatzabrechnungModel', [
  '$resource',
  'API_URL',
  'exportODSModuleFunction',
  function($resource, API_URL, exportODSModuleFunction) {
    return $resource(
      API_URL + 'arbeitseinsatzabrechnung/:id:exportType',
      {
        id: '@id'
      },
      {
        exportODS: exportODSModuleFunction
      }
    );
  }
]);
