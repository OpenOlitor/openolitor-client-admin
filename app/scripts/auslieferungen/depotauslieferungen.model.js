'use strict';

/**
 */
angular.module('openolitor')
  .factory('DepotAuslieferungenModel', function($resource, API_URL) {
    return $resource(API_URL + 'depotauslieferungen/:id', {
      id: '@id'
    });
  });
