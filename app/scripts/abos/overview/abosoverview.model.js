'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('AbosOverviewModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'abos/:id:exportType', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
