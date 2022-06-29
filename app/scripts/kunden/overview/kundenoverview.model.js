'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('KundenOverviewModel', ['$resource', 'appConfig', 'exportODSModuleFunction', function($resource, appConfig, exportODSModuleFunction) {
    return $resource(appConfig.get().API_URL + 'kunden/:id:exportType', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction,
      'kundenSearch': {
        method: 'GET',
        isArray: true,
        url: appConfig.get().API_URL + 'kundenSearch'
      }
    });
  }]);
