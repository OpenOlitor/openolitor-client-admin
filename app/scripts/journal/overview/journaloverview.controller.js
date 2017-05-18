'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('JournalOverviewController', ['$q', '$scope', '$filter',
    'JournalModel', 'NgTableParams', 'localeSensitiveComparator',
    'OverviewCheckboxUtil', 'FilterQueryUtil', '$location',
    function($q, $scope, $filter, JournalModel, NgTableParams, localeSensitiveComparator,
      OverviewCheckboxUtil, FilterQueryUtil, $location) {

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};

      $scope.search = {
        query: '',
        queryQuery: '',
        filterQuery: ''
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
            sequenceNr: 'desc'
          },
          filter: {
            typen: ''
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: JournalModel,
          exportODSFilter: function() {
            return {
              f: $scope.search.filterQuery
            };
          },
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries, $scope.search.queryQuery);
            // also filter by ngtable filters
            filteredData = $filter('filter')(filteredData, params.filter());
            var orderedData = $filter('orderBy')(filteredData, params.orderBy(), false, localeSensitiveComparator);

            params.total(orderedData.length);
            $scope.loading = false;
            return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });
      }

      function initSearch() {
        $scope.entries = JournalModel.query({
          f: $scope.search.filterQuery,
          limit: 100000
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
          $location.search('q', $scope.search.query);
        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.loading = true;
        $scope.tableParams.reload();

        // initSearch();
      }

      $scope.getFirstEntry = function(array) {
        if(!angular.isUndefined(array)) {
          for (var key in array) {
            if (array.hasOwnProperty(key)) {
              return array[key];
            }
          }
        }
      };

      $scope.getFirstKey = function(array) {
        if(!angular.isUndefined(array)) {
          for (var key in array) {
            if (array.hasOwnProperty(key)) {
              return key;
            }
          }
        }
      };

      $scope.prettyPrintJson = function(json) {
        return JSON.stringify(json, null, 2);
      };

      $scope.actions = [];

      var existingQuery = $location.search().q;
      if (existingQuery) {
        $scope.search.query = existingQuery;
      }

      $scope.$watch('search.query', function() {
        $scope.search.filterQuery = FilterQueryUtil.transform($scope.search
          .query);
        $scope.search.queryQuery = FilterQueryUtil.withoutFilters($scope.search
          .query);
        search();
      }, true);

      initSearch();
    }
  ]);
