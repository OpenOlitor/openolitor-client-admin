'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitsangeboteModel', ['$resource', 'appConfig', 'exportODSModuleFunction', function($resource, appConfig, exportODSModuleFunction) {
    return $resource(appConfig.get().API_URL + 'arbeitsangebote/:id:exportType', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction
    });
  }]);
