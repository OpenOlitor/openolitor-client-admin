'use strict';

/**
 */
angular.module('openolitor')
  .factory('LieferungenListModel', function($resource, API_URL) {
    return $resource(API_URL +
      'abotypen/:abotypId/vertriebsarten/:vertriebsartId/lieferungen/:id', {
        id: '@id',
        abotypId: '@abotypId'
      });
  });
