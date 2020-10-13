'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZahlungsImportsOverviewModel', ['$resource', 'appConfig', 'exportODSModuleFunction', function($resource, appConfig, exportODSModuleFunction) {
    return $resource(appConfig.get().API_URL + 'zahlungsimports/:id', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
