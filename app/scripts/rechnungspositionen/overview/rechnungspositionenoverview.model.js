'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('RechnungsPositionenOverviewModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'rechnungspositionen/:id:exportType', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
