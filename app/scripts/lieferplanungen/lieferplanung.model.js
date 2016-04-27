'use strict';

/**
 */
angular.module('openolitor')
  .factory('LieferplanungModel', function($resource, API_URL) {
    return $resource(API_URL + 'lieferplanungen/:id', {
      id: '@id'
    },
    {
      'getLieferungen': {method:'GET', isArray: true, url: API_URL + 'lieferplanungen/:id/lieferungen'}
    });
  });
