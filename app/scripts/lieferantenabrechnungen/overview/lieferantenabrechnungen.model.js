'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('LieferantenAbrechnungenOverviewModel', function($resource, API_URL) {
    return $resource(API_URL + 'lieferanten/bestellungen/:id', {
      id: '@id'
    });
  });
