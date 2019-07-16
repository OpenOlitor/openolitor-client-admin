'use strict';

/**
 */
angular.module('openolitor-admin').factory('ZusatzabosOverviewModel', [
  '$resource',
  'API_URL',
  'exportODSModuleFunction',
  function($resource, API_URL, exportODSModuleFunction) {
    return $resource(
      API_URL + 'zusatzabos/:id:exportType',
      {
        id: '@id'
      },
      {
        exportODS: exportODSModuleFunction
      }
    );
  }
]);
