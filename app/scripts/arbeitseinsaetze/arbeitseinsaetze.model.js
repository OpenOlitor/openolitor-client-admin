'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitseinsaetzeModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'arbeitseinsaetze/:id:exportType', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
