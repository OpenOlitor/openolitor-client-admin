'use strict';

angular.module('openolitor-admin')
  .factory('JournalModel', ['$resource', 'appConfig', 'exportODSModuleFunction', 'exportODSModuleFunction',
  function($resource, appConfig, exportODSModuleFunction) {
    return $resource(appConfig.get().API_URL + 'admin/events/', { } , {
      'exportODS': exportODSModuleFunction
    });
  }]);
