'use strict';

/**
 */
angular.module('openolitor')
  .factory('KundenDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'kunden/:id', {
      id: '@id'
    });
  });
