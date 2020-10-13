'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('EinkaufsrechnungenOverviewModel', ['$resource', 'appConfig', 'exportODSModuleFunction', function($resource, appConfig, exportODSModuleFunction) {
    return $resource(appConfig.get().API_URL + 'lieferanten/sammelbestellungen/:id:exportType', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
