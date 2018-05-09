'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ProduzentenOverviewController', ['$q', '$scope', '$filter',
    'ProduzentenModel', 'NgTableParams', 'localeSensitiveComparator',
    'OverviewCheckboxUtil', '$location', 'ReportvorlagenService', 'FilterQueryUtil', 'gettext',
    function($q, $scope, $filter, ProduzentenModel, NgTableParams, localeSensitiveComparator,
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

      $scope.checkboxes = {
        checked: false,
        checkedAny: false,
        items: {},
        css: '',
        ids: []
      };

      // watch for check all checkbox
      $scope.$watch(function() {
        return $scope.checkboxes.checked;
      }, function(value) {
        OverviewCheckboxUtil.checkboxWatchCallback($scope, value);
      });

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function() {
        OverviewCheckboxUtil.dataCheckboxWatchCallback($scope);
      }, true);

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            kurzzeichen: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: ProduzentenModel,
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
        $scope.entries = ProduzentenModel.query({
          f: $scope.search.filterQuery
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
          $location.search('q', $scope.search.query);
        });
      }

      search();

      $scope.projektVorlagen = function() {
        return ReportvorlagenService.getVorlagen('VorlageProduzentenbrief');
      };

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };

      $scope.closeBerichtFunct = function() {
        return $scope.closeBericht;
      };

      $scope.actions = [{
        labelFunction: function() {
          return gettext('Produzent erstellen');
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          return $location.path('/produzenten/new');
        }
      }, {
        label: gettext('Produzentenbrief'),
        noEntityText: true,
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
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
    }
  ]);
