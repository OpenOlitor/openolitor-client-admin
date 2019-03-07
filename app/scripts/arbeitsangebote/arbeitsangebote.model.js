'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitsangeboteModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'arbeitsangebote/:id:exportType', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
