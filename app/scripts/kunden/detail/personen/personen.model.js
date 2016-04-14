'use strict';

/**
 */
angular.module('openolitor')
  .factory('PersonenListModel', function($resource, API_URL) {
    return $resource(API_URL + 'kunden/:kundeId/personen/:id', {
      id: '@id',
      kundeId: '@kundeId'
    });
  });
