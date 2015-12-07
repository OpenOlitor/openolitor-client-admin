'use strict';

/**
 */
angular.module('openolitor')
  .factory('PersonenOverviewModel', function($resource, API_URL) {
    return $resource(API_URL + 'personen/:id', {
      id: '@id'
    });
  });
