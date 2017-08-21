'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('RechnungsPositionenOverviewController', ['$q', '$scope', '$filter',
    '$location',
    'RechnungsPositionenModel', 'NgTableParams', '$http', 'FileUtil',
    'DataUtil', 'EnumUtil',
    'OverviewCheckboxUtil', 'API_URL', 'FilterQueryUtil', 'RECHNUNGSPOSITIONSSTATUS',
    'msgBus', 'lodash', 'VorlagenService', 'localeSensitiveComparator',
    function($q, $scope, $filter, $location, RechnungsPositionenModel,
      NgTableParams, $http, FileUtil, DataUtil, EnumUtil,
      OverviewCheckboxUtil, API_URL,
      FilterQueryUtil, RECHNUNGSPOSITIONSSTATUS, msgBus, lodash, VorlagenService,
      localeSensitiveComparator) {

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};
      $scope.rechnungsPositionenStatus = EnumUtil.asArray(RECHNUNGSPOSITIONSSTATUS);

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

      $scope.selectRechnungsPosition = function(rechnungsPosition, itemId) {
        var firstRow = angular.element('#rechnungsPositionenTable tbody tr').first();
        var allButtons = angular.element('#rechnungsPositionenTable button');
        allButtons.removeClass('btn-warning');
        allButtons.removeClass('active');

        if ($scope.selectedRechnungsPosition === rechnungsPosition) {
          $scope.selectedRechnungsPosition = undefined;
        } else {
          $scope.selectedRechnungsPosition = rechnungsPosition;

          var button = angular.element('#' + itemId);
          button.addClass('btn-warning');
          button.addClass('active');
          var offset = button.offset().top - firstRow.offset().top + 154;
          angular.element('#selectedRechnungsPositionDetail').css('margin-top', offset);
        }
      };

      $scope.actions = [{
        label: 'Rechnungsposition löschen',
        iconClass: 'fa fa-times',
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        },
        onExecute: function() {
          var result = lodash.filter($scope.checkboxes.data, function(d) {
            return lodash.includes($scope.checkboxes.ids, d.id);
          });
          angular.forEach(result, function(r) {
            r.$delete();
          });
        }
      }];

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            name: 'asc'
          },
          filter: {
            status: ''
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: RechnungsPositionenModel,
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var dataSet = $filter('filter')($scope.entries, $scope.search.queryQuery);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), true, localeSensitiveComparator) :
              dataSet;

            $scope.filteredEntries = dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) *
              params.count(), params.page() * params.count());
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
        $scope.entries = RechnungsPositionenModel.query({
          f: $scope.search.filterQuery
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
          $location.search('q', $scope.search.query);
        });
      }

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
