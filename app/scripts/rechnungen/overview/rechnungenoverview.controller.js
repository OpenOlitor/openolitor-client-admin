'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('RechnungenOverviewController', ['$q', '$scope', '$filter',
    '$location',
    'RechnungenOverviewModel', 'NgTableParams', '$http', 'FileUtil',
    'DataUtil', 'EnumUtil',
    'OverviewCheckboxUtil', 'API_URL', 'FilterQueryUtil', 'RECHNUNGSTATUS',
    'msgBus', 'lodash', 'VorlagenService', 'localeSensitiveComparator',
    function($q, $scope, $filter, $location, RechnungenOverviewModel,
      NgTableParams, $http, FileUtil, DataUtil, EnumUtil,
      OverviewCheckboxUtil, API_URL,
      FilterQueryUtil, RECHNUNGSTATUS, msgBus, lodash, VorlagenService,
      localeSensitiveComparator) {

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
          '/aktionen/downloadrechnung', 'Rechnung ' + rechnung.id,
          'application/pdf',
          function() {
            rechnung.isDownloading = false;
          });
      };

      $scope.downloadMahnung = function(rechnung, fileId) {
        rechnung.isDownloadingMahnung = true;
        FileUtil.downloadGet('rechnungen/' + rechnung.id +
          '/aktionen/download/' + fileId, 'Rechnung ' + rechnung.id + ' Mahnung',
          'application/pdf',
          function() {
            rechnung.isDownloadingMahnung = false;
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

      $scope.projektVorlagen = function() {
        return VorlagenService.getVorlagen('VorlageRechnung');
      };

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
        label: 'Rechnungsdokumente erstellen',
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.showGenerateRechnungReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny ||
            alleRechnungenStorniertOderBezahlt($scope.checkboxes.ids,
              $scope.checkboxes.data);
        }
      }, {
        label: 'Mahnungsdokumente erstellen',
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.showGenerateMahnungReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny ||
            alleRechnungenStorniertOderBezahlt($scope.checkboxes.ids,
              $scope.checkboxes.data);
        }
      }, {
        label: 'Rechnungsdokumente herunterladen',
        iconClass: 'fa fa-download',
        onExecute: function() {
          return FileUtil.downloadPost('rechnungen/aktionen/downloadrechnungen', {
            'ids': $scope.checkboxes.ids
          });
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny ||
            !hasRechnungDocument($scope.checkboxes.ids,
              $scope.checkboxes.data);
        }
      }, {
        label: 'Mahnungsdokumente herunterladen',
        iconClass: 'fa fa-download',
        onExecute: function() {
          return FileUtil.downloadPost('rechnungen/aktionen/downloadmahnungen', {
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
        label: 'Kundenliste anzeigen',
        iconClass: 'fa fa-user',
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        },
        onExecute: function() {
          var result = lodash.filter($scope.checkboxes.data, function(d) {
            return lodash.includes($scope.checkboxes.ids, d.id);
          });
          result = lodash.map(result, 'kundeId');
          $location.path('/kunden').search('q', 'id=' + result.join());
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
          exportODSModel: RechnungenOverviewModel,
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries,
              $scope.search.queryQuery);
            var orderedData = $filter('filter')(filteredData, params.filter());
            orderedData = params.sorting ?
              $filter('orderBy')(orderedData, params.orderBy(), true, localeSensitiveComparator) :
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

      $scope.closeRechnungBericht = function() {
        $scope.showGenerateRechnungReport = false;
      };

      $scope.closeMahnungBericht = function() {
        $scope.showGenerateMahnungReport = false;
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
