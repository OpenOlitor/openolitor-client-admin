'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('AuslieferungenOverviewController', ['$q', '$scope', '$rootScope', '$filter',
    '$route',
    'DepotAuslieferungenModel', 'TourAuslieferungenModel',
    'PostAuslieferungenModel', 'NgTableParams', 'AUSLIEFERUNGSTATUS', 'msgBus',
    'ReportvorlagenService', 'localeSensitiveComparator', '$location', 'FilterQueryUtil', 'gettext',
    'lodash', 'gettextCatalog',
    function($q, $scope, $rootScope, $filter, $route, DepotAuslieferungenModel,
      TourAuslieferungenModel, PostAuslieferungenModel, NgTableParams,
      AUSLIEFERUNGSTATUS, msgBus, ReportvorlagenService, localeSensitiveComparator,
      $location, FilterQueryUtil, gettext, lodash, gettextCatalog) {
      $rootScope.viewId = 'L-Aus';

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};

      $scope.search = {
        query: ''
      };

      var model = $route.current.$$route.model;
      var overviewModel;

      switch (model) {
        case 'Depot':
          overviewModel = DepotAuslieferungenModel;
          break;
        case 'Tour':
          overviewModel = TourAuslieferungenModel;
          break;
        case 'Post':
          overviewModel = PostAuslieferungenModel;
          break;
      }

      $scope.projektVorlagen = function() {
        if ($scope.vorlageTyp === 'KorbUebersicht' || $scope.vorlageTyp === 'KorbDetails'){
          return ReportvorlagenService.getVorlagen('Vorlage'+$scope.vorlageTyp);
        } else {
          return ReportvorlagenService.getVorlagen('Vorlage'+model+$scope.vorlageTyp);
        }
      };

      $scope.statusL = [];
      angular.forEach(lodash.sortBy(AUSLIEFERUNGSTATUS, function(as){
          return gettextCatalog.getString(as).toLowerCase();
      }), function(value, key) {
        $scope.statusL.push({
          'id': key,
          'title': gettextCatalog.getString(value)
        });
      });

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
        angular.forEach($scope.filteredEntries, function(item) {
          $scope.checkboxes.items[item.id] = value;
        });
      });

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function() {
        var checked = 0,
          unchecked = 0,
          total = $scope.filteredEntries.length;
        $scope.checkboxes.ids = [];
        angular.forEach($scope.filteredEntries, function(item) {
          checked += ($scope.checkboxes.items[item.id]) || 0;
          unchecked += (!$scope.checkboxes.items[item.id]) || 0;
          if ($scope.checkboxes.items[item.id]) {
            $scope.checkboxes.ids.push(item.id);
          }
        });
        if ((unchecked === 0) || (checked === 0)) {
          $scope.checkboxes.checked = (checked === total) && checked > 0;
          $scope.checkboxes.checkedAny = (checked > 0);
        }
        // grayed checkbox
        else if ((checked !== 0 && unchecked !== 0)) {
          $scope.checkboxes.css = 'select-all:indeterminate';
          $scope.checkboxes.checkedAny = true;
        } else {
          $scope.checkboxes.css = 'select-all';
          $scope.checkboxes.checkedAny = true;
        }
      }, true);

      $scope.actions = [{
        label: gettext('Lieferschein drucken'),
        iconClass: 'fa fa-print',
        onExecute: function() {
          $scope.reportType = 'lieferschein';
          $scope.vorlageTyp = 'Lieferschein';
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: gettext('Lieferetiketten drucken'),
        iconClass: 'fa fa-print',
        onExecute: function() {
          $scope.$broadcast("resetDirectiveGenerateReport");
          $scope.reportType = 'lieferetiketten';
          $scope.vorlageTyp = 'Lieferetiketten';
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: gettext('Korbübersicht drucken'),
        iconClass: 'fa fa-print',
        onExecute: function() {
          $scope.$broadcast("resetDirectiveGenerateReport");
          $scope.reportType = 'korbuebersicht';
          $scope.vorlageTyp = 'KorbUebersicht';
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: gettext('Korbdetails drucken'),
        iconClass: 'fa fa-print',
        onExecute: function() {
          $scope.$broadcast("resetDirectiveGenerateReport");
          $scope.reportType = 'korbdetails';
          $scope.vorlageTyp = 'KorbDetails';
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: gettext('Als ausgeliefert markieren'),
        iconClass: 'fa fa-bicycle',
        onExecute: function() {
          return overviewModel.ausliefern($scope.checkboxes.ids);
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }];

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            datum: 'asc'
          },
          filter: {
            status: undefined
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: overviewModel,
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
            var dataSet = $filter('filter')($scope.entries, $scope.search.queryQuery);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), true, localeSensitiveComparator) :
              dataSet;

            $scope.filteredEntries = dataSet;

            params.total(dataSet.length);

            $location.search({'q': $scope.search.query, 'tf': JSON.stringify($scope.tableParams.filter())});

            return dataSet.slice((params.page() - 1) * params.count(),
              params.page() * params.count());
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
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = overviewModel.query({
          f: $scope.search.filterQuery
        }, function(result) {
          $scope.entries = result;
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      var existingQuery = $location.search().q;
      if (existingQuery) {
        $scope.search.query = existingQuery;
      }

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };

      $scope.closeBerichtFunct = function() {
        return $scope.closeBericht;
      };

      $scope.$watch('search.query', function() {
        $scope.search.filterQuery = FilterQueryUtil.transform($scope.search
          .query);
        $scope.search.queryQuery = FilterQueryUtil.withoutFilters($scope.search
          .query);
        search();
      }, true);

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity.indexOf('Auslieferung') >= 0) {
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
