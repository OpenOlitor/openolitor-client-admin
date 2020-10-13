'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZahlungsEingaengeModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'zahlungsimports/:zahlungsImportId/zahlungseingaenge/:id/:extendedPath/:aktion', {
      zahlungsImportId: '@zahlungsImportId',
      id: '@id'
    }, {
      erledigen: {
        method: 'POST',
        params: {
          extendedPath: 'aktionen',
          aktion: 'erledigen'
        }
      },
      automatischErledigen: {
        method: 'POST',
        params: {
          extendedPath: 'aktionen',
          aktion: 'automatischerledigen'
        }
      }
    });
  });
