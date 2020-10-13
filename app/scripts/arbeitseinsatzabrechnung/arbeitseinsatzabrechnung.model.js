'use strict';

/**
 */
angular.module('openolitor-admin').factory('ArbeitseinsatzabrechnungModel', [
  '$resource',
  'appConfig',
  'exportODSModuleFunction',
  function($resource, appConfig, exportODSModuleFunction) {
    return $resource(
      appConfig.get().API_URL + 'arbeitseinsatzabrechnung/:id:exportType',
      {
        id: '@id'
      },
      {
        exportODS: exportODSModuleFunction
      }
    );
  }
]);
