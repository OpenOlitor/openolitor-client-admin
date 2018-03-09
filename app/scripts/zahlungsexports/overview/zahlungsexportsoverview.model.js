'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZahlungsExportsOverviewModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'zahlungsexports/:id', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
