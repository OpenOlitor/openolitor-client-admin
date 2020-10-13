'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitseinsaetzeModel', ['$resource', 'appConfig', 'exportODSModuleFunction', function($resource, appConfig, exportODSModuleFunction) {
    return $resource(appConfig.get().API_URL + 'arbeitseinsaetze/:id:exportType', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
