'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZahlungsImportsOverviewModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'zahlungsimports/:id', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
