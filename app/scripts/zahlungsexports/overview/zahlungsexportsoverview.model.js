'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZahlungsExportsOverviewModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'zahlungsexports/:id', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction,
      'fetchFile': {
        url: API_URL + 'zahlungsexports/:id/download',
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
