'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ReportsModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'reports/:id:exportType', {
      id: '@id'
    }, {
      'executeReport': {
        method: 'POST',
        isArray: true,
        url: API_URL + 'reports/:id/execute'
      },
      'exportODS': {
        method: 'POST',
        url: API_URL + 'reports/:id/execute.ods',
        responseType: 'arraybuffer',
        cache: false,
        transformResponse: exportODSModuleFunction.transformResponse
        }
      });
  }]);
