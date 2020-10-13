'use strict';

/**
 */
angular.module('openolitor-admin').factory('ZusatzabosOverviewModel', [
  '$resource',
  'appConfig',
  'exportODSModuleFunction',
  function($resource, appConfig, exportODSModuleFunction) {
    return $resource(
      appConfig.get().API_URL + 'zusatzabos/:id:exportType',
      {
        id: '@id'
      },
      {
        exportODS: exportODSModuleFunction
      }
    );
  }
]);
