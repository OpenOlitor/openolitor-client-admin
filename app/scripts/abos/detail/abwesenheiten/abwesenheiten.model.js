'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('AbwesenheitenListModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL +
      'kunden/:kundeId/abos/:aboId/abwesenheiten/:id', {
        id: '@id',
        aboId: '@aboId',
        kundeId: '@kundeId'
      });
  });
