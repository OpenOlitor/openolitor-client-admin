'use strict';

/**
 */
angular.module('openolitor')
  .controller('TourenDetailController', ['$scope', '$filter',
    'TourenService', 'TourenModel', 'ngTableParams', 'cloneObj', '$routeParams',
    function($scope, $filter, TourenService, TourenModel, ngTableParams, cloneObj, $routeParams) {

      $scope.entries = [];
      $scope.loading = false;

      var defaults = {
        model: {
          id: undefined,
          name: '',
          beschreibung: undefined,
          editable: true
        }
      };

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      $scope.edit = function(tour) {
        tour.editable = true;
        $scope.editing = true;
      };

      $scope.save = function(tour) {
        tour.editable = false;
        $scope.editing = false;
        $scope.tour = new TourenModel(tour);
        return $scope.tour.$save();
      };

      $scope.delete = function(tour) {
        tour.editable = false;
        $scope.tour = new TourenModel(tour);
        return $scope.tour.$delete();
      };

      $scope.loadTour = function() {
        TourenModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.tour = result;
        });
      };

      if (!$routeParams.id) {
        $scope.tour = new TourenModel(defaults.model);
      } else {
        $scope.loadTour();
      }
    }
  ]);
