'use strict';

/**
 */
angular.module('openolitor')
  .controller('ZahlungsImportsController', ['$scope', '$rootScope', '$filter',
    '$routeParams', '$http',
    '$location', '$uibModal', 'gettext', 'ZahlungsImportsModel',
    'EnumUtil', 'API_URL', 'msgBus',
    function($scope, $rootScope, $filter, $routeParams, $http, $location, $uibModal,
      gettext,
      ZahlungsImportsModel, EnumUtil, API_URL,
      msgBus) {

      var defaults = {
        model: {
          id: undefined,
        }
      };

      $scope.loading = false;

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'ZahlungsImport') {
          $rootScope.$apply();
        }
      });

      $scope.isExisting = function() {
        return angular.isDefined($scope.zahlungsImport) && angular.isDefined($scope.zahlungsImport.id);
      };

      $scope.delete = function() {
        return $scope.zahlungsImport.$delete();
      };
    }
  ]);
