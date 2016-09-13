'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('TourenModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'touren/:id', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
