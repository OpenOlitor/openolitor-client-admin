'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('RechnungsPositionenOverviewController', ['$q', '$scope', '$rootScope', '$filter',
    '$location',
    'RechnungsPositionenModel', 'NgTableParams', '$http', 'FileUtil',
    'DataUtil', 'EnumUtil',
    'OverviewCheckboxUtil', 'API_URL', 'FilterQueryUtil', 'RECHNUNGSPOSITIONSSTATUS',
    'msgBus', 'lodash', 'ReportvorlagenService', 'localeSensitiveComparator', 'gettextCatalog',
    function($q, $scope, $rootScope, $filter, $location, RechnungsPositionenModel,
      NgTableParams, $http, FileUtil, DataUtil, EnumUtil,
      OverviewCheckboxUtil, API_URL,
      FilterQueryUtil, RECHNUNGSPOSITIONSSTATUS, msgBus, lodash, ReportvorlagenService,
      localeSensitiveComparator, gettextCatalog) {
      $rootScope.viewId = 'L-Repo';

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};
      $scope.rechnungsPositionenStatus = lodash.sortBy(EnumUtil.asArray(RECHNUNGSPOSITIONSSTATUS), function(rps){
          return gettextCatalog.getString(rps.label).toLowerCase();
      });

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
        checkedItems: [],
        css: '',
        ids: []
      };

      // watch for check all checkbox
      $scope.$watch(function() {
        return $scope.checkboxes.checked;
      }, function(value) {
        OverviewCheckboxUtil.checkboxWatchCallback($scope, value);
      });

      $scope.projektVorlagen = function() {
        return ReportvorlagenService.getVorlagen('VorlageRechnung');
      };

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function() {
        OverviewCheckboxUtil.dataCheckboxWatchCallback($scope);
      }, true);

      $scope.selectRechnungsPosition = function(rechnungsPosition, itemId) {
        var allRows = angular.element('#rechnungsPositionTable table tbody tr');
        allRows.removeClass('row-selected');

        if ($scope.selectedRechnungsPosition === rechnungsPosition) {
          $scope.selectedRechnungsPosition = undefined;
        } else {
          $scope.selectedRechnungsPosition = rechnungsPosition;
          var row = angular.element('#' + itemId);
          row.addClass('row-selected');
        }
      };

      $scope.unselectRechnungsPosition = function() {
        var allRows = angular.element('#rechnungsPositionTable table tbody tr');
        allRows.removeClass('row-selected');
        $scope.selectedRechnungsPosition = undefined;
      };

      $scope.unselectRechnungsPositionFunct = function() {
        return $scope.unselectRechnungsPosition;
      };

      $scope.closeCreateRechnungenDialog = function() {
        $scope.showCreateRechnungenDialog = false;
      };

      $scope.closeCreateRechnungenDialogFunct = function() {
        return $scope.closeCreateRechnungenDialog;
      };

      $scope.actions = [{
        label: 'Rechnungen erstellen',
        iconClass: 'glyphicon glyphicon-plus',
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        },
        onExecute: function() {
          $scope.showCreateRechnungenDialog = true;
          return true;
        }
      }, {
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

            $location.search({'q': $scope.search.query, 'tf': JSON.stringify($scope.tableParams.filter())});

            return dataSet.slice((params.page() - 1) *
              params.count(), params.page() * params.count());
          }

        });

        var existingFilter = $location.search().tf;
        if (existingFilter) {
          $scope.tableParams.filter(JSON.parse(existingFilter));
        }
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

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (msg.entity === 'RechnungsPosition') {
          var removed = lodash.remove($scope.entries, function(r) {
            return r.id === msg.data.id;
          });
          if (removed !== []) {
            $scope.tableParams.reload();

            $scope.$apply();
          }
        }
      });

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity == 'RechnungsPosition') {
          $scope.entries.map(function(entry) {
            if(entry.id === msg.data.id) {
              angular.copy(msg.data, entry);
            }
          });
          $scope.$apply();
        }
      });

    }
  ]);
