'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('AbosDetailModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kunden/:kundeId/abos/:id/:extendedPath/:aktion', {
      id: '@id',
      kundeId: '@kundeId'
    }, {
      guthabenAnpassen: {
        method: 'POST',
        params: {
          extendedPath: 'aktionen',
          aktion: 'guthabenanpassen'
        },
        data: {
          guthabenNeu: undefined,
          bemerkung: undefined
        }
    }
    });
  });
