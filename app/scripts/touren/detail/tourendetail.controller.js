'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('TourenDetailController', ['$scope', '$filter',
    'TourenService', 'TourenDetailModel', 'NgTableParams', 'cloneObj', '$routeParams', '$location',
    function($scope, $filter, TourenService, TourenDetailModel, NgTableParams, cloneObj, $routeParams, $location) {

      $scope.unsortedTourlieferungen = [];
      $scope.sortedTourlieferungen = [];
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

      $scope.created = function(id) {
        $location.path('/touren/' + id);
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

      $scope.onSort = function(movedTourlieferung, partFrom, partTo) {
        // update the index of each sorted tourlieferung entry
        if (partTo == $scope.sortedTourlieferungen) {
          angular.forEach($scope.sortedTourlieferungen, function(tourlieferung, index) {
            tourlieferung.sort = index;
          });
        }

        // disable dropping back to unsorted
        if (partTo == $scope.unsortedTourlieferungen && angular.isDefined(movedTourlieferung.sort)) {
          $scope.unsortedTourlieferungen.splice(movedTourlieferung);
        }
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

      $scope.checkUnsorted = function() {
        var hasUnsorted = false;
        angular.forEach($scope.tour.tourlieferungen, function(tourlieferung) {
          if (angular.isUndefined(tourlieferung.sort)) {
            hasUnsorted = true;
            if ($scope.unsortedTourlieferungen.indexOf(tourlieferung) === -1) {
              $scope.unsortedTourlieferungen.push(tourlieferung);
            }
          } else {
            if ($scope.sortedTourlieferungen.indexOf(tourlieferung) === -1) {
              $scope.sortedTourlieferungen.push(tourlieferung);
            }
          }
        });
        $scope.hasUnsorted = hasUnsorted;
      };

      if (!$routeParams.id || $routeParams.id === 'new') {
        $scope.tour = new TourenDetailModel(defaults.model);
      } else {
        $scope.loadTour();
      }
    }
  ]);
