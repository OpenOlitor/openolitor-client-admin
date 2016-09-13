'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ProdukteModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'produkte/:id:exportType', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
