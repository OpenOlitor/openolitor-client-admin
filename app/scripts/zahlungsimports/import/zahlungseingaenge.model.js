'use strict';

/**
 */
angular.module('openolitor')
  .factory('ZahlungsEingaengeModel', function($resource, API_URL) {
    return $resource(API_URL + 'zahlungsimports/:zahlungsImportId/zahlungseingaenge/:id/:extendedPath/:aktion', {
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
