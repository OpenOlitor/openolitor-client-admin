'use strict';

/**
 */
angular.module('openolitor')
  .factory('RechnungenDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'rechnungen/:id/:extendedPath/:aktion', {
      id: '@id'
    }, {
      verschicken: {
        method: 'POST',
        params: {
          extendedPath: 'aktionen',
          aktion: 'verschicken'
        }
      },
      mahnungVerschicken: {
        method: 'POST',
        params: {
          extendedPath: 'aktionen',
          aktion: 'mahnungverschicken'
        }
      },
      bezahlen: {
        method: 'POST',
        params: {
          extendedPath: 'aktionen',
          aktion: 'bezahlen'
        }
      },
      stornieren: {
        method: 'POST',
        params: {
          extendedPath: 'aktionen',
          aktion: 'stornieren'
        }
      },
      berichtRechnung: {
        method: 'POST',
        transformRequest: angular.identity,
        headers:  { 'Content-Type': undefined },
        params: {
          extendedPath: 'berichte',
          aktion: 'rechnung'
        }
      }
    });
  });
