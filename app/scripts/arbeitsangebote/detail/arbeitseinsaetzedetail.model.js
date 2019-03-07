'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitseinsaetzeDetailModel', ['$resource', 'API_URL', function($resource, API_URL) {
    return $resource(API_URL + 'arbeitsangebote/:arbeitsangebotId/arbeitseinsaetze/:id', {
      arbeitsangebotId: '@arbeitsangebotId',
      id: '@id'
    });
  }]);
