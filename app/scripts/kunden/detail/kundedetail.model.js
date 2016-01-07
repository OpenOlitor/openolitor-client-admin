'use strict';

/**
 */
angular.module('openolitor')
  .factory('PersonenDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'personen/:id', {
      id: '@id'
    });
  });
