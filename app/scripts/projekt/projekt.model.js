'use strict';

/**
*/
angular.module('openolitor-admin')
  .factory('OpenProjektModel', ['$resource', 'appConfig', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'open/projekt', {
    }, {'query': {method:'GET', isArray: false},
    'fetchStyle': {
        url: appConfig.get().API_URL + 'ressource/style/:style/download',
        method: 'GET',
        responseType: 'arraybuffer',
        transformResponse: function (data) {
            var file;
            if (data) {
                file = new Blob([data], {
                    type: 'text/css'
                });
            }
            return {
                response: file
            };
        }
    },
    'fetchImportFile': {
        url: appConfig.get().API_URL + 'open/projekt/importFile',
        method: 'GET',
        responseType: 'arraybuffer',
        transformResponse: function (data) {
            var file;
            if (data) {
                file = new Blob([data], {
                    type: 'application/vnd.oasis.opendocument.spreadsheet'
                });
            }
            return {
                response: file
            };
        }
    }});
  }])
  .factory('ProjektModel', ['$resource', 'appConfig', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'projekt/:id', {
    id: '@id'
    }, {
    'query': {method:'GET', isArray: false},
    'geschaeftsjahre': {
        url: appConfig.get().API_URL + 'projekt/:id/geschaeftsjahre',
        method:'GET',
        isArray: true
      }
    }
  );
  }]);
