'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('TourenOverviewController', ['$scope', '$filter',
    'TourenService', 'TourenModel', 'NgTableParams', 'cloneObj',
    function($scope, $filter, TourenService, TourenModel, NgTableParams, cloneObj) {

      $scope.entries = [];
      $scope.loading = false;

      $scope.search = {
        query: ''
      };

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

      //watch for set of produkte
      $scope.$watch(TourenService.getTouren,
        function(list) {
          if (list) {
            $scope.entries = [];
            angular.forEach(list, function(item) {
              if (item.id) {
                $scope.entries.push(item);
              }
            });
            $scope.tableParams.reload();
          }
        });

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            name: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries, $scope
              .search.query);
            var orderedData = params.sorting ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              filteredData;
            orderedData = $filter('filter')(orderedData, params.filter());

            params.total(orderedData.length);
            return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.tableParams.reload();
      }

      $scope.$watch('search.query', function() {
        search();
      }, true);

      $scope.tourErstellen = function() {
        if(angular.isUndefined($scope.entries)) {
          $scope.entries = [];
        }
        $scope.editing = true;
        $scope.entries.push(cloneObj(defaults.model));
        $scope.tableParams.reload();
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

    }
  ]);
