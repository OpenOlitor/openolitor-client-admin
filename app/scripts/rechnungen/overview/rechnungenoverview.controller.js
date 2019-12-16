'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('RechnungenOverviewController', ['$q', '$scope', '$rootScope', '$filter',
    '$location','KundenOverviewModel',
    'RechnungenOverviewModel', 'NgTableParams', '$http', 'FileUtil',
    'DataUtil', 'EnumUtil',
    'OverviewCheckboxUtil', 'API_URL', 'FilterQueryUtil', 'RECHNUNGSTATUS', 'PAYMENT_TYPES',
    'msgBus', 'lodash', 'ReportvorlagenService', 'localeSensitiveComparator', 'gettext', 'DetailNavigationService','FileSaver',
    function($q, $scope, $rootScope, $filter, $location, KundenOverviewModel, RechnungenOverviewModel,
      NgTableParams, $http, FileUtil, DataUtil, EnumUtil,
      OverviewCheckboxUtil, API_URL,
      FilterQueryUtil, RECHNUNGSTATUS, PAYMENT_TYPES, msgBus, lodash, ReportvorlagenService,
      localeSensitiveComparator, gettext, DetailNavigationService, FileSaver) {
      $rootScope.viewId = 'L-Re';

      $scope.showCreateEMailDialog = false;
      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};

      function getFullName(item, index) {
          if (index === 0){
           var array = {
               id : undefined,
               title : item.label
           }
           return array;
          } else {
          var array = {
               id : item.id,
               title : item.label
           }
           return array;
          }
      }

      $scope.paymentTypes = lodash.sortBy(EnumUtil.asArray(PAYMENT_TYPES), function(pt) {
          return pt.title.toLowerCase();
      });

      $scope.rechnungStati = lodash.sortBy(EnumUtil.asArray(RECHNUNGSTATUS), function(rs) {
          return rs.title.toLowerCase();
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
        css: '',
        ids: []
      };

      $scope.navigateToKunde = function(id) {
        $scope.filteredEntries = [];
        var listKundeIds = []
        var currentKundeId = $filter('filter')($scope.entries,{id:id},true)[0];
        angular.forEach($scope.checkboxes.ids, function(id){
            listKundeIds.push($scope.checkboxes.data[id].kundeId);
        });

        var allEntries = KundenOverviewModel.query({
            f: $scope.search.filterQuery
        }, function() {
            angular.forEach(listKundeIds, function(kundeId){
                $scope.filteredEntries.push($filter('filter')(allEntries,{id:kundeId},true)[0]);
            });
            DetailNavigationService.detailFromOverview(currentKundeId.kundeId, $scope, 'kunden', $location.url());
        });
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

      $scope.navigateToDetail = function(id) {
        DetailNavigationService.detailFromOverview(id, $scope, 'rechnungen', $location.url());
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

      var allRechnungDocumentCreated = function(selectedItems, items) {
        var length = selectedItems.length;
        for (var i = 0; i < length; ++i) {
          var id = selectedItems[i];
          if (!items[id].fileStoreId) {
            return false;
          }
        }
        return true;
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

      $scope.actions = [{
        labelFunction: function() {
          return gettext('Rechnung erstellen');
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          return $location.path('/rechnungen/new');
        }
      }, {
        label: gettext('Rechnungsdokumente erstellen'),
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.$broadcast("resetDirectiveGenerateReport");
          $scope.showGenerateRechnungReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny ||
            alleRechnungenStorniertOderBezahlt($scope.checkboxes.ids,
              $scope.checkboxes.data);
        }
      }, {
        label: gettext('Mahnungsdokumente erstellen'),
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.$broadcast("resetDirectiveGenerateReport");
          $scope.showGenerateMahnungReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny ||
            alleRechnungenStorniertOderBezahlt($scope.checkboxes.ids,
              $scope.checkboxes.data);
        }
      }, {
        label: gettext('Rechnungsdokumente herunterladen'),
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
        label: gettext('Mahnungsdokumente herunterladen'),
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
        label: gettext('Rechnungen verschickt'),
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
        label: gettext('Kundenliste anzeigen'),
        iconClass: 'fa fa-user',
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        },
        onExecute: function() {
          var result = lodash.filter($scope.checkboxes.data, function(d) {
            return lodash.includes($scope.checkboxes.ids, d.id);
          });
          result = lodash.map(result, 'kundeId');
          $location.search({'tf':''});
          $location.path('/kunden').search('q', 'id=' + result.join());
        }
      }, {
        label: gettext('Rechungen per E-Mail verschicken'),
        iconClass: 'fa fa-envelope-o',
        onExecute: function() {
          //TODO OO-762 using Mail-Service functionality on Overview
          return false;
        },
        isDisabled: function() {
          return true;
        }
      }, {
        label: gettext('E-Mail Formular'),
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-pencil',
        onExecute: function() {
          $scope.$broadcast("resetDirectiveEmailDialog");
          $scope.entity = gettext('rechnung');
          $scope.url = 'mailing/sendEmailToInvoicesSubscribers';
          $scope.message = gettext('Wenn Sie folgende Label einfügen, werden sie durch den entsprechenden Wert ersetzt: \n {{person.anrede}} \n {{person.vorname}} \n {{person.name}} \n {{person.rolle}} \n {{person.kundeId}} \n {{rechnung.titel}} \n {{rechnung.betrag}}  \n {{rechnung.rechnungsDatum}}  \n {{rechnung.faelligkeitsDatum}}  \n {{rechnung.referenzNummer} \n {{rechnung.esrNummer}} \n {{rechnung.strasse}} \n {{rechnung.plz}} \n {{rechnung.ort}}');
          $scope.rechnungIdsMailing = _($scope.filteredEntries)
            .keyBy('id')
            .at(Object.keys($scope.checkboxes.items))
            .map('id')
            .value();
          $scope.attachment = allRechnungDocumentCreated($scope.checkboxes.ids, $scope.checkboxes.data);
          $scope.showCreateEMailDialog = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
        }, {
        label: gettext('pain.008.001.07 erstellen'),
        iconClass: 'fa fa-download',
        onExecute: function() {
          return $http.post(API_URL + 'rechnungen/aktionen/pain_008_001_07', {
            'ids': $scope.checkboxes.ids
          }).then(function(file) {
             var data = new Blob([file.data], { type: 'text/plain;charset=utf-8' });
             FileSaver.saveAs(data, 'pain_008_001_07.xml');
          });
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }},{
        label: gettext('Rechnungen löschen'),
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
          exportODSModel: RechnungenOverviewModel,
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
        $scope.entries = RechnungenOverviewModel.query({
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

      $scope.closeRechnungBericht = function() {
        $scope.showGenerateRechnungReport = false;
      };

      $scope.closeRechnungBerichtFunct = function() {
        return $scope.closeRechnungBericht;
      };

      $scope.closeMahnungBericht = function() {
        $scope.showGenerateMahnungReport = false;
      };

      $scope.closeMahnungBerichtFunct = function() {
        return $scope.closeMahnungBericht;
      };

      $scope.closeCreateEMailDialog = function() {
        $scope.showCreateEMailDialog = false;
      };

      $scope.closeCreateEMailDialogFunct = function() {
        return $scope.closeCreateEMailDialog;
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

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (msg.entity === 'Rechnung') {
          var removed = lodash.remove($scope.entries, function(r) {
            return r.id === msg.data.id;
          });
          if (removed !== []) {
            $scope.tableParams.reload();

            $scope.$apply();
          }
        }
      });
    }
  ]);
