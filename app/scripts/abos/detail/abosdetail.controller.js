'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbosDetailController', ['$scope', '$filter', '$routeParams', '$location', 'gettext', 'AbosDetailModel', 'AbotypenOverviewModel', 'AbotypenDetailModel', 'LIEFERRHYTHMEN', 'EnumUtil', function($scope, $filter, $routeParams, $location, gettext, AbosDetailModel, AbotypenOverviewModel, AbotypenDetailModel) {

    var defaults = {
      model: {
        id: undefined,
        abotypId: undefined
      }
    };

    if (!$routeParams.id) {
      $scope.abo = new AbosDetailModel(defaults.model);
    } else {
      AbosDetailModel.get({
        id: $routeParams.id
      }, function(result) {
        $scope.abo = result;
      });
    }

    $scope.abotypen = AbotypenOverviewModel.query({
      aktiv: true
    });

    $scope.isExisting = function() {
      return angular.isDefined($scope.abo) && angular.isDefined($scope.abo.id);
    };

    $scope.save = function() {
      $scope.abo.$save(function(result) {
        if (!$scope.isExisting()) {
          $location.path('/abos/' + result.id);
        }
      });
    };

    $scope.cancel = function() {
      $location.path('/abos');
    };

    $scope.delete = function() {
      $scope.abo.$delete();
    };

    $scope.$watch('abo.abotypId', function(abotypId) {
      if (abotypId) {
        AbotypenDetailModel.get({
          id: abotypId
        }, function(abotyp) {
          $scope.abotyp = abotyp;
        });
        $scope.abotyp = {vertriebsarten:[{id: 'Depotlieferung', label: 'Depotlieferung'}]};
      }
    });
  }]);
