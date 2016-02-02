'use strict';

/**
 */
angular.module('openolitor')
  .factory('PendenzenOverviewModel', function($resource, API_URL) {
    return $resource(API_URL + 'pendenzen/:id', {
      id: '@id'
    });
  });
