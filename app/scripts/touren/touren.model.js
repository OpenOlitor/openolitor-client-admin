'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('TourenModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'touren/:id/:extendedPath', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction,
      personen: {
        method: 'GET',
        isArray: true,
        params: {
          extendedPath: 'personen'
        }
      }
    });
  }]);
