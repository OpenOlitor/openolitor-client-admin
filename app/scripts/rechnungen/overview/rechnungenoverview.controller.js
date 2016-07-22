'use strict';

/**
 */
angular.module('openolitor')
  .controller('RechnungenOverviewController', ['$q', '$scope', '$filter',
    '$location',
    'RechnungenOverviewModel', 'NgTableParams', '$http', 'FileUtil',
    'DataUtil', 'EnumUtil',
    'OverviewCheckboxUtil',
    'API_URL', 'FilterQueryUtil', 'RECHNUNGSTATUS', 'msgBus', 'lodash',
    function($q, $scope, $filter, $location, RechnungenOverviewModel,
      NgTableParams, $http, FileUtil, DataUtil, EnumUtil,
      OverviewCheckboxUtil, API_URL,
      FilterQueryUtil, RECHNUNGSTATUS, msgBus, lodash) {

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};
      $scope.rechnungStati = EnumUtil.asArray(RECHNUNGSTATUS);

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

      $scope.downloadRechnung = function(rechnung) {
        rechnung.isDownloading = true;
        FileUtil.downloadGet('rechnungen/' + rechnung.id +
          '/aktionen/download', 'Rechnung ' + rechnung.id,
          'application/pdf',
          function() {
            rechnung.isDownloading = false;
          });
      };

      var alleRechnungenStorniertOderBezahlt = function(selectedItems, items) {
        var length = selectedItems.length;
        for (var i = 0; i < length; ++i) {
          var id = selectedItems[i];
          if (items[id].status !== RECHNUNGSTATUS.STORNIERT &&
            items[id].status !== RECHNUNGSTATUS.BEZAHLT) {
            return false;
          }
        }
        return true;
      };

      var hasRechnungDocument = function(selectedItems, items) {
        var length = selectedItems.length;
        for (var i = 0; i < length; ++i) {
          var id = selectedItems[i];
          if (items[id].fileStoreId) {
            return true;
          }
        }
        return false;
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

      $scope.actions = [{
        labelFunction: function() {
          return 'Rechnung erstellen';
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          return $location.path('/rechnungen/new');
        }
      }, {
        label: 'Dokumente erstellen',
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny ||
            alleRechnungenStorniertOderBezahlt($scope.checkboxes.ids,
              $scope.checkboxes.data);
        }
      }, {
        label: 'Dokumente herunterladen',
        iconClass: 'fa fa-download',
        onExecute: function() {
          return FileUtil.downloadPost('rechnungen/aktionen/download', {
            'ids': $scope.checkboxes.ids
          });
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny ||
            !hasRechnungDocument($scope.checkboxes.ids,
              $scope.checkboxes.data);
        }
      }, {
        label: 'Rechnungen verschickt',
        iconClass: 'fa fa-exchange',
        onExecute: function() {
          return $http.post(API_URL + 'rechnungen/aktionen/verschicken', {
            'ids': $scope.checkboxes.ids
          }).then(function() {
            $scope.model.actionInProgress = undefined;
          });
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: 'Email Versand*',
        iconClass: 'fa fa-envelope-o',
        onExecute: function() {
          return false;
        },
        isDisabled: function() {
          return true;
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
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries,
              $scope.search.queryQuery);
            var orderedData = $filter('filter')(filteredData, params.filter());
            orderedData = params.sorting ?
              $filter('orderBy')(orderedData, params.orderBy()) :
              orderedData;

            $scope.filteredEntries = filteredData;

            params.total(orderedData.length);
            return orderedData.slice((params.page() - 1) *
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
        $scope.entries = RechnungenOverviewModel.query({
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

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity === 'Rechnung') {
          var rechnung = lodash.find($scope.entries, function(r) {
            return r.id === msg.data.id;
          });
          if (rechnung) {
            DataUtil.update(msg.data, rechnung);

            var filteredRechnung = lodash.find($scope.filteredEntries,
              function(r) {
                return r.id === msg.data.id;
              });
            if (filteredRechnung) {
              DataUtil.update(msg.data, filteredRechnung);

              $scope.tableParams.reload();
            }

            $scope.$apply();
          }
        }
      });
    }
  ]);
