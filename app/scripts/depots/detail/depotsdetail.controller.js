'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('DepotsDetailController', ['$scope', '$filter', '$routeParams',
    '$location', 'gettext', 'DepotsDetailModel',
    function($scope, $filter, $routeParams, $location, gettext,
      DepotsDetailModel) {

      var defaults = {
        model: {
          id: undefined,
          aktiv: true
        }
      };

      if (!$routeParams.id || $routeParams.id === 'new') {
        $scope.depot = new DepotsDetailModel(defaults.model);
      } else {
        DepotsDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.depot = result;
        });
      }

      $scope.isExisting = function() {
        return angular.isDefined($scope.depot) && angular.isDefined($scope.depot
          .id);
      };

      $scope.fullName = function() {
        if ($scope.depot && $scope.depot.name) {
          return 'Depot: ' + $scope.depot.name;
        }
        return undefined;
      };

      $scope.save = function() {
        return $scope.depot.$save();
      };

      $scope.created = function(id) {
        $location.path('/depots/' + id);
      };

      $scope.backToList = function() {
        $location.path('/depots');
      };

      $scope.delete = function() {
        return $scope.depot.$delete();
      };
    }
  ]);
