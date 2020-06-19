'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('DepotAuslieferungenModel', ['$resource', 'appConfig', 'exportODSModuleFunction',
    function($resource, appConfig, exportODSModuleFunction) {
    return $resource(appConfig.get().API_URL + 'depotauslieferungen/:id:exportType/:extendedPath/:aktion', {
      id: '@id'
    }, {
      ausliefern: {
        method: 'POST',
        params: {
          extendedPath: 'aktionen',
          aktion: 'ausliefern'
        }
      },
      'exportODS': exportODSModuleFunction
    });
  }]);
