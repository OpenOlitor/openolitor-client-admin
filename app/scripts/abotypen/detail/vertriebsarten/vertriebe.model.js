'use strict';

/**
 */
angular.module('openolitor')
  .factory('VertriebeListModel', function($resource, API_URL) {
    return $resource(API_URL + 'abotypen/:abotypId/vertriebe/:id', {
      id: '@id',
      abotypId: '@abotypId'
    });
  });
