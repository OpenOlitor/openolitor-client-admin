'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitseinsaetzeDetailModel', ['$resource', 'appConfig', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'arbeitsangebote/:arbeitsangebotId/arbeitseinsaetze/:id', {
      arbeitsangebotId: '@arbeitsangebotId',
      id: '@id'
    });
  }]);
