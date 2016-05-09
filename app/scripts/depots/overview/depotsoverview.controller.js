'use strict';

/**
 */
angular.module('openolitor')
  .controller('DepotsOverviewController', ['$scope', '$filter',
    'DepotsOverviewModel', 'ngTableParams',
    function($scope, $filter, DepotsOverviewModel, ngTableParams) {

      $scope.entries = [];
      $scope.loading = false;

      $scope.search = {
        query: ''
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
            orderedData = $filter('filter')(orderedData, params.filter());

            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
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
        $scope.entries = DepotsOverviewModel.query({
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

    }
  ]);
