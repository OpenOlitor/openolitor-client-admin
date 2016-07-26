'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('KundentypenModel', function($resource, API_URL) {
    return $resource(API_URL + 'kundentypen/:id', {
      id: '@id'
    });
  });
