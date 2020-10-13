'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('KundenRechnungenModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kunden/:kundeId/rechnungen', {
      kundeId: '@kundeId'
    });
  });
