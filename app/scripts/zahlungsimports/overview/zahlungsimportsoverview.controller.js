'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ZahlungsImportsOverviewController', ['$q', '$scope', '$rootScope', '$filter',
    'ZahlungsImportsOverviewModel', 'NgTableParams', 'localeSensitiveComparator',
    'FilterQueryUtil',
    function($q, $scope, $rootScope, $filter, ZahlungsImportsOverviewModel, NgTableParams,
      localeSensitiveComparator, FilterQueryUtil) {
      $rootScope.viewId = 'L-ZaEx';

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
            var dataSet = $filter('filter')($scope.entries, $scope.search.query);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), true, localeSensitiveComparator) :
              dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) * params.count(), params.page() * params.count());
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
          f: $scope.search.filterQuery,
          q: $scope.search.queryQuery,
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      $scope.$watch('search.query', function() {
        $scope.search.filterQuery = FilterQueryUtil.transform($scope.search
          .query);
        $scope.search.queryQuery = FilterQueryUtil.withoutFilters($scope.search
          .query);
        search();
      }, true);

    }
  ]);
