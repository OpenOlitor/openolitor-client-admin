'use strict';

/**
 */
angular.module('openolitor')
  .controller('TourenDetailController', ['$scope', '$filter',
    'TourenService', 'TourenDetailModel', 'ngTableParams', 'cloneObj', '$routeParams',
    function($scope, $filter, TourenService, TourenDetailModel, ngTableParams, cloneObj, $routeParams) {

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
        });
      };

      $scope.sortableOptions = {
        stop: function() {
          angular.forEach($scope.tour.tourlieferungen, function(tourlieferung, index) {
            tourlieferung.sort = index;
          });
          $scope.$apply();
        }
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

      if (!$routeParams.id) {
        $scope.tour = new TourenDetailModel(defaults.model);
      } else {
        $scope.loadTour();
      }
    }
  ]);
