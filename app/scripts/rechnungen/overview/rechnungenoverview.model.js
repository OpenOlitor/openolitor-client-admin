'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('RechnungenOverviewModel', function($resource, API_URL) {
    return $resource(API_URL + 'rechnungen/:id', {
      id: '@id'
    });
  });
