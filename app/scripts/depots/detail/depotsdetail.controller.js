'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('DepotsDetailController', ['$scope', '$filter', '$routeParams',
    '$location', 'gettext', 'DepotsDetailModel', 'gettextCatalog',
    function($scope, $filter, $routeParams, $location, gettext,
      DepotsDetailModel, gettextCatalog) {

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
          $scope.depotForm.$setPristine();
        });
      }

      $scope.delete = function() {
        if ($scope.depot.anzahlAbonnenten > 0) {
          return;
        }
        return $scope.depot.$delete();
      };

      $scope.isExisting = function() {
        return angular.isDefined($scope.depot) && angular.isDefined($scope.depot
          .id);
      };

      $scope.fullName = function() {
        if ($scope.depot && $scope.depot.name) {
          return gettextCatalog.getString('Depot:') + ' ' + $scope.depot.name;
        }
        return undefined;
      };

      $scope.save = function() {
        return $scope.depot.$save(function() {
          $scope.depotForm.$setPristine();
        });
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
