'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('KundenOverviewModel', function($resource, API_URL) {
    return $resource(API_URL + 'kunden/:id', {
      id: '@id'
    });
  });
