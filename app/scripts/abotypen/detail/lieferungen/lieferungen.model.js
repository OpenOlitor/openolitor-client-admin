'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('LieferungenListModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL +
      'abotypen/:abotypId/vertriebe/:vertriebId/lieferungen/:id', {
        id: '@id',
        abotypId: '@abotypId',
        vertriebId: '@vertriebId'
      });
  });
