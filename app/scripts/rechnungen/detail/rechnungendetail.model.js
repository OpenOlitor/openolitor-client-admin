'use strict';

/**
 */
angular.module('openolitor')
  .factory('RechnungenDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'rechnungen/:id', {
      id: '@id'
    });
  });
