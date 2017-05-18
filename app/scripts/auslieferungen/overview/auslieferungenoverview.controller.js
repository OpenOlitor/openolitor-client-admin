'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('AuslieferungenOverviewController', ['$q', '$scope', '$filter',
    '$route',
    'DepotAuslieferungenModel', 'TourAuslieferungenModel',
    'PostAuslieferungenModel', 'NgTableParams', 'AUSLIEFERUNGSTATUS', 'msgBus',
    'VorlagenService', 'localeSensitiveComparator', '$location', 'FilterQueryUtil',
    function($q, $scope, $filter, $route, DepotAuslieferungenModel,
      TourAuslieferungenModel, PostAuslieferungenModel, NgTableParams,
      AUSLIEFERUNGSTATUS, msgBus, VorlagenService, localeSensitiveComparator,
      $location, FilterQueryUtil) {

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
        return VorlagenService.getVorlagen('Vorlage'+model+$scope.vorlageTyp);
      };

      $scope.statusL = [];
      angular.forEach(AUSLIEFERUNGSTATUS, function(value, key) {
        $scope.statusL.push({
          'id': key,
          'title': value
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
        label: 'Lieferschein drucken',
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
        label: 'Lieferetiketten drucken',
        iconClass: 'fa fa-print',
        onExecute: function() {
          $scope.reportType = 'lieferetiketten';
          $scope.vorlageTyp = 'Lieferetikette';
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: 'Korbübersicht drucken',
        iconClass: 'fa fa-print',
        onExecute: function() {
          $scope.reportType = 'korbuebersicht';
          $scope.vorlageTyp = 'Korbuebersicht';
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: 'Als ausgeliefert markieren',
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
          exportODSModel: overviewModel,
          exportODSFilter: function() {
            return {
              f: $scope.search.filterQuery
            };
          },
          filter: {
            status: undefined
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
            var filteredData = $filter('filter')($scope.entries, $scope.search.queryQuery);
            // also filter by ngtable filters
            filteredData = $filter('filter')(filteredData, params.filter());
            var orderedData = $filter('filter')(filteredData, params.filter());
            orderedData = params.sorting ?
              $filter('orderBy')(orderedData, params.orderBy(), true, localeSensitiveComparator) :
              orderedData;

            $scope.filteredEntries = filteredData;

            params.total(orderedData.length);
            return orderedData.slice((params.page() - 1) * params.count(),
              params.page() * params.count());
          }

        });
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
          $location.search('q', $scope.search.query);
        });
      }

      var existingQuery = $location.search().q;
      if (existingQuery) {
        $scope.search.query = existingQuery;
      }

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
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
