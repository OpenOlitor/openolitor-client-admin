'use strict';

/**
 */
angular.module('openolitor')
  .factory('KundenOverviewModel', function($resource, API_URL) {
    return $resource(API_URL + 'kunden/:id', {
      id: '@id'
    });
  });
