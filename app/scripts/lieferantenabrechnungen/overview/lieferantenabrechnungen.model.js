'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('LieferantenAbrechnungenOverviewModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'lieferanten/sammelbestellungen/:id:exportType', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
