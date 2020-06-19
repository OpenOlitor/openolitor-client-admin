'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('VertriebsartenListModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'abotypen/:abotypId/vertriebe/:vertriebId/vertriebsarten/:id', {
      id: '@id',
      abotypId: '@abotypId',
      vertriebId: '@vertriebId'
    });
  });
