'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbotypenOverviewController', ['$scope', '$filter',
    'AbotypenOverviewModel', 'ngTableParams',
    function($scope, $filter, AbotypenOverviewModel, ngTableParams) {

      $scope.entries = undefined;
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
        $scope.entries = AbotypenOverviewModel.query({
          q: $scope.query
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      $scope.style = function(abotyp) {
        if (abotyp.farbCode) {
          return {
            'background-color': abotyp.farbCode
          };
        }
      };

      load();

      $scope.$watch('search.query', function() {
        search();
      }, true);

    }
  ]);
