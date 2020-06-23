'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZusatzAbotypenModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'zusatzAbotypen/'
    );
  });
