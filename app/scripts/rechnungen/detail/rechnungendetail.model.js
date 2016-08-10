'use strict';

/**
 */
angular.module('openolitor-admin')
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
        //IMPORTANT!!! You might think this should be set to 'multipart/form-data'
        // but this is not true because when we are sending up files the request
        // needs to include a 'boundary' parameter which identifies the boundary
        // name between parts in this multi-part request and setting the Content-type
        // manually will not set this boundary parameter. For whatever reason,
        // setting the Content-type to 'false' will force the request to automatically
        // populate the headers properly including the boundary parameter.
        headers: {
          'Content-Type': false
        },
        // angular.identity prevents Angular to do anything on our data (like serializing it).
        transformRequest: angular.identity,
        params: {
          extendedPath: 'berichte',
          aktion: 'rechnung'
        }
      }
    });
  });
