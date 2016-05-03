'use strict';

/**
 */
angular.module('openolitor')
  .controller('ZahlungsImportsOverviewController', ['$q', '$scope', '$filter',
    'ZahlungsImportsOverviewModel', 'ngTableParams',
    function($q, $scope, $filter, ZahlungsImportsOverviewModel, ngTableParams) {

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
          },
          filter: { status: '' }
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
            var filteredData = $filter('filter')($scope.entries,
              $scope.search.query);
            var orderedData = params.sorting ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              filteredData;
            orderedData = $filter('filter')($scope.entries, params.filter());

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        //  $scope.entries = $scope.dummyEntries;
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = ZahlungsImportsOverviewModel.query({
          q: $scope.query
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      search();

      $scope.$watch('search.query', function() {
        search();
      }, true);

    }
  ]);

