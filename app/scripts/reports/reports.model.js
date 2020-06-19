'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ReportsModel', ['$resource', 'appConfig', 'exportODSModuleFunction', function($resource, appConfig, exportODSModuleFunction) {
    return $resource(appConfig.get().API_URL + 'reports/:id:exportType', {
      id: '@id'
    }, {
      'executeReport': {
        method: 'POST',
        isArray: true,
        url: appConfig.get().API_URL + 'reports/:id/execute'
      },
      'exportODS': {
        method: 'POST',
        url: appConfig.get().API_URL + 'reports/:id/execute.ods',
        responseType: 'arraybuffer',
        cache: false,
        transformResponse: exportODSModuleFunction.transformResponse
        }
      });
  }]);
