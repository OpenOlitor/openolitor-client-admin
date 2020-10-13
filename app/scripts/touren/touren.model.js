'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('TourenModel', ['$resource', 'appConfig', 'exportODSModuleFunction', function($resource, appConfig, exportODSModuleFunction) {
    return $resource(appConfig.get().API_URL + 'touren/:id/:extendedPath/:extendedPathPlus', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction,
      personen: {
        method: 'GET',
        isArray: true,
        params: {
          extendedPath: 'personen',
          extendedPathPlus: 'aktiv',
        }
      }
    });
  }]);
