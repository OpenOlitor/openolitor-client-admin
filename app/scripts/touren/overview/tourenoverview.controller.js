'use strict';

/**
 */
angular.module('openolitor')
  .controller('TourenOverviewController', ['$scope', '$filter',
    'TourenOverviewModel', 'ngTableParams', 'cloneObj',
    function($scope, $filter, TourenOverviewModel, ngTableParams, cloneObj) {

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

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new ngTableParams({ // jshint ignore:line
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
          getData: function($defer, params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries, $scope
              .search.query);
            var orderedData = params.sorting ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              filteredData;
            orderedData = $filter('filter')(filteredData, params.filter());

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.tableParams.reload();
      }

      function load() {
        if ($scope.loading) {
          return;
        }

        $scope.loading = true;
        $scope.entries = TourenOverviewModel.query({
          q: $scope.query
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      load();

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
        $scope.tour = new TourenOverviewModel(tour);
        return $scope.tour.$save();
      };

      $scope.delete = function(tour) {
        tour.editable = false;
        $scope.tour = new TourenOverviewModel(tour);
        return $scope.tour.$delete();
      };

    }
  ]);
