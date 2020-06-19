'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZahlungsExportsOverviewModel', ['$resource', 'appConfig', 'exportODSModuleFunction', function($resource, appConfig, exportODSModuleFunction) {
    return $resource(appConfig.get().API_URL + 'zahlungsexports/:id', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction,
      'fetchFile': {
        url: appConfig.get().API_URL + 'zahlungsexports/:id/download',
        method: 'GET',
        responseType: 'arraybuffer',
        transformResponse: function (data) {
            var file;
            if (data) {
                file = new Blob([data], {
                    type: 'text/xml'
                });
            }
            return {
                response: file
            };
        }
    }});
  }]);
