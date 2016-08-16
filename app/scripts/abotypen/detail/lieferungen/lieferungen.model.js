'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('LieferungenListModel', function($resource, API_URL) {
    return $resource(API_URL +
      'abotypen/:abotypId/vertriebe/:vertriebId/lieferungen/:id', {
        id: '@id',
        abotypId: '@abotypId',
        vertriebId: '@vertriebId'
      });
  });
