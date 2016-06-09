'use strict';

/**
 */
angular.module('openolitor')
  .factory('TourAuslieferungenModel', function($resource, API_URL) {
    return $resource(API_URL + 'tourauslieferungen/:id', {
      id: '@id'
    });
  });
