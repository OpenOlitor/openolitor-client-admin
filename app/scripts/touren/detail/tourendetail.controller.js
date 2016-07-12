'use strict';

/**
 */
angular.module('openolitor')
  .controller('TourenDetailController', ['$scope', '$filter',
    'TourenService', 'TourenDetailModel', 'NgTableParams', 'cloneObj', '$routeParams',
    function($scope, $filter, TourenService, TourenDetailModel, NgTableParams, cloneObj, $routeParams) {

      $scope.entries = [];
      $scope.loading = false;

      var defaults = {
        model: {
          id: undefined,
          name: '',
          beschreibung: undefined,
          editable: true,
          tourlieferungen: []
        }
      };

      $scope.edit = function(tour) {
        tour.editable = true;
        $scope.editing = true;
      };

      $scope.save = function(tour) {
        tour.editable = false;
        $scope.editing = false;
        $scope.tour = new TourenDetailModel(tour);
        return $scope.tour.$save();
      };

      $scope.delete = function(tour) {
        tour.editable = false;
        $scope.tour = new TourenDetailModel(tour);
        return $scope.tour.$delete();
      };

      $scope.loadTour = function() {
        TourenDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.tour = result;
          $scope.checkUnsorted();
        });
      };

      $scope.onSort = function() {
        angular.forEach($scope.tour.tourlieferungen, function(tourlieferung, index) {
          tourlieferung.sort = index;
        });
        $scope.checkUnsorted();
      };

      $scope.isExisting = function() {
        return angular.isDefined($scope.tour) && angular.isDefined($scope.tour.id);
      };

      $scope.actions = [{
        labelFunction: function() {
          if ($scope.isExisting()) {
            return 'speichern';
          } else {
            return 'erstellen';
          }
        },
        onExecute: function() {
          return $scope.tour.$save();
        }
      }];

      $scope.sortFilter = function(tourlieferung) {
        return angular.isDefined(tourlieferung.sort);
      };

      $scope.unsortFilter = function(tourlieferung) {
        return angular.isUndefined(tourlieferung.sort);
      };

      $scope.checkUnsorted = function() {
        var hasUnsorted = false;
        angular.forEach($scope.tour.tourlieferungen, function(tourlieferung) {
          if (angular.isUndefined(tourlieferung.sort)) {
            hasUnsorted = true;
          }
        });
        $scope.hasUnsorted = hasUnsorted;
      };

      if (!$routeParams.id) {
        $scope.tour = new TourenDetailModel(defaults.model);
      } else {
        $scope.loadTour();
      }
    }
  ]);
