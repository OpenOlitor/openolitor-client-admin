'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ReportsOverviewController', ['$q', '$scope', '$filter',
    'ReportsModel', 'NgTableParams', 'localeSensitiveComparator',
    'OverviewCheckboxUtil', '$location', 'ReportvorlagenService', 'FilterQueryUtil', 'gettext',
    function($q, $scope, $filter, ReportsModel, NgTableParams, localeSensitiveComparator,
      OverviewCheckboxUtil, $location, ReportvorlagenService, FilterQueryUtil, gettext) {

      $scope.entries = [];
      $scope.filteredEntries = [];
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
            var dataSet = $filter('filter')($scope.entries, $scope.search.queryQuery);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), false, localeSensitiveComparator) :
              dataSet;

            $scope.filteredEntries = dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = ReportsModel.query({
          f: $scope.search.filterQuery
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
          $location.search('q', $scope.search.query);
        });
      }

      search();

      $scope.actions = [{
        labelFunction: function() {
          return gettext('Auswertung erstellen');
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          return $location.path('/reports/new');
        }
      }];

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

      $scope.executeReport = function(report) {
        $location.path('/reports/' + report.id + '/execute');
      };
    }
  ]);
