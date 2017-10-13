'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('KontoDatenService', ['$rootScope', 'KontoDatenModel', 'msgBus', 'ooAuthService', '$q',
    function($rootScope, KontoDatenModel, msgBus, ooAuthService, $q) {

      var kontodaten;

      var loadKontoDaten = function() {
        var deferred = $q.defer();

        ooAuthService.resolveUser().then(function() {
          if (kontodaten) {
            deferred.resolve(kontodaten);
          } else {
            KontoDatenModel.query({}, function(result) {
              kontodaten = result;
              deferred.resolve(kontodaten);
            }, function(error) {
              deferred.reject(error);
            });
          }
        });

        return deferred.promise;
      };

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'KontoDaten') {
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'KontoDaten') {
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'KontoDaten') {
          $rootScope.$apply();
        }
      });

      return {
        resolveKontodaten: loadKontoDaten
      };
    }
  ]);
