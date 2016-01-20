'use strict';

/**
 */
angular.module('openolitor')
  .factory('VertriebsartenListModel', function($resource, API_URL) {
    return $resource(API_URL + 'abotypen/:abotypId/vertriebsarten/:id', {
      id: '@id',
      abotypId: '@abotypId'
    });
  });
