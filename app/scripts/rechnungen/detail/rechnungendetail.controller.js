'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('RechnungenDetailController', ['$scope', '$rootScope', '$filter',
    '$routeParams', '$http',
    '$location', '$uibModal', 'gettext', 'RechnungenDetailModel',
    'EnumUtil', 'appConfig', 'msgBus', '$log', 'moment', 'KundenOverviewModel',
    'KundenDetailModel',
    'RECHNUNGSTATUS', 'FileUtil', 'DataUtil', 'ReportvorlagenService', 'DetailNavigationService',
    function($scope, $rootScope, $filter, $routeParams, $http, $location,
      $uibModal,
      gettext,
      RechnungenDetailModel, EnumUtil, appConfig,
      msgBus, $log, moment, KundenOverviewModel, KundenDetailModel,
      RECHNUNGSTATUS, FileUtil, DataUtil, ReportvorlagenService, DetailNavigationService) {
      $rootScope.viewId = 'D-Re';

      DetailNavigationService.cleanKundeList();

      var defaults = {
        model: {
          id: undefined,
          waehrung: 'CHF',
          rechnungsDatum: new Date(),
          faelligkeitsDatum: new Date(moment().add(1, 'month').subtract(1,
            'day').valueOf()),
          status: RECHNUNGSTATUS.ERSTELLT
        }
      };

      $scope.projektVorlagen = function() {
        return ReportvorlagenService.getVorlagen('VorlageRechnung');
      };

      $scope.loading = false;

      function getAboEntry(abo) {
        return {
          id: abo.id,
          label: '' + abo.abotypName + ' (' + abo.id + ')'
        };
      }

      function resolveKunde(id, fillRechnungsAdresse) {
        return KundenDetailModel.get({
          id: id
        }, function(kunde) {
          $scope.kunde = kunde;
          $scope.rechnung.kundeId = kunde.id;
          $scope.rechnung.bezeichnung = kunde.bezeichnung;
          if(fillRechnungsAdresse) {
            $scope.rechnung.strasse = kunde.strasse;
            $scope.rechnung.hausNummer = kunde.hausNummer;
            $scope.rechnung.adressZusatz = kunde.adressZusatz;
            $scope.rechnung.plz = kunde.plz;
            $scope.rechnung.ort = kunde.ort;
          }

          $scope.abos = kunde.abos.map(getAboEntry);
        }).$promise;
      }


      $scope.getKunden = function(filter) {
        if ($scope.loading) {
          return;
        }

        $scope.loading = true;

        return KundenOverviewModel.query({
          q: filter
        }, function() {
          $scope.loading = false;
        }).$promise.then(function(kunden) {
          var filtered = $filter('filter')(kunden, filter);
          console.log('Filtered: ', filtered, ' with filter ', filter);
          return filtered;
        });
      };

      $scope.loadKunde = function(selected) {
        if(selected && selected.id) {
          resolveKunde(selected.id, true);
        }
      };

      $scope.loadRechnung = function() {
        RechnungenDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.rechnung = result;
          resolveKunde(result.kunde.id, false);
          $scope.aboId = result.abo.id;
          $scope.rechnung.aboId = result.abo.id;
        });
      };

      if (!$routeParams.id) {
        $scope.rechnung = new RechnungenDetailModel(defaults.model);
      } else {
        $scope.loadRechnung();
      }

      if (!$routeParams.kundeId) {
        $scope.kunde = undefined;
      } else {
        resolveKunde($routeParams.kundeId,true).then(function() {
          if ($routeParams.aboId) {
            $scope.aboId = parseInt($routeParams.aboId);
            $scope.rechnung.aboId = $scope.aboId;
          }
        });
      }

      $scope.selectedAbo = function(abo) {
        $scope.rechnung.aboId = abo.id;
        $scope.aboId = abo.id;
        return false;
      };

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Rechnung' && msg.data.id === $scope.rechnung.id) {
          DataUtil.update(msg.data, $scope.rechnung);
          $rootScope.$apply();
        }
      });

      $scope.open = {
        rechnungsdatum: false,
      };

      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      $scope.isExisting = function() {
        return angular.isDefined($scope.rechnung) && angular.isDefined(
          $scope.rechnung
          .id);
      };

      $scope.isVerschickt = function() {
        return $scope.isExisting() &&
          ($scope.rechnung.status === RECHNUNGSTATUS.VERSCHICKT ||
            $scope.rechnung.status === RECHNUNGSTATUS.MAHNUNG_VERSCHICKT ||
            $scope.rechnung.status === RECHNUNGSTATUS.BEZAHLT);
      };

      $scope.isDeletable = function() {
        return $scope.isExisting() && $scope.rechnung.status ===
          RECHNUNGSTATUS.ERSTELLT;
      };

      $scope.save = function() {
        return $scope.rechnung.$save(function(){
          $scope.rechnungForm.$setPristine();
        });
      };

      $scope.created = function(id) {
        $location.path('/rechnungen/' + id);
      };

      $scope.backToList = function() {
        $location.path('/rechnungen');
      };

      $scope.canEdit = function() {
        return !$scope.isExisting() ||
          $scope.rechnung.status === RECHNUNGSTATUS.ERSTELLT;
      };

      $scope.canEditBetrag = function() {
        return !$scope.isExisting() ||
          $scope.rechnung.status === RECHNUNGSTATUS.ERSTELLT &&
          $scope.rechnung.rechnungsPositionen === 0;
      };

      $scope.downloadRechnung = function() {
        $scope.isDownloading = true;
        FileUtil.downloadGet('rechnungen/' + $scope.rechnung.id +
          '/aktionen/downloadrechnung', 'Rechnung ' + $scope.rechnung.id,
          'application/pdf',
          function() {
            $scope.isDownloading = false;
          });
      };

      $scope.downloadMahnung = function(fileId) {
        $scope.isDownloadingMahnung = true;
        FileUtil.downloadGet('rechnungen/' + $scope.rechnung.id +
          '/aktionen/download/' + fileId, 'Rechnung ' + $scope.rechnung.id + ' Mahnung',
          'application/pdf',
          function() {
            $scope.isDownloadingMahnung = false;
          });
      };

      $scope.actions = [{
        labelFunction: function() {
          if ($scope.isExisting()) {
            return gettext('Rechnung speichern');
          } else {
            return gettext('Rechnung erstellen');
          }
        },
        onExecute: function() {
          return $scope.rechnung.$save(function(){
            $scope.rechnungForm.$setPristine();
          });
        },
        isDisabled: function() {
          return $scope.isExisting() && $scope.rechnung.status !==
            RECHNUNGSTATUS.ERSTELLT;
        },
        noEntityText: true
      }, {
        label: gettext('Rechnung verschickt'),
        iconClass: 'fa fa-exchange',
        onExecute: function() {
          return $scope.rechnung.$verschicken();
        },
        isDisabled: function() {
          return $scope.isExisting() && $scope.rechnung.status !==
            RECHNUNGSTATUS.ERSTELLT;
        },
        noEntityText: true
      }, {
        label: gettext('Rechung per E-Mail verschicken'),
        iconClass: 'fa fa-envelope-o',
        onExecute: function() {
          //TODO OO-762 using Mail-Service functionality on Overview
          return false;
        },
        isDisabled: function() {
          return true;
        },
        noEntityText: true
      }, {
        label: gettext('Mahnung verschickt'),
        iconClass: 'fa fa-exclamation',
        onExecute: function() {
          return $scope.rechnung.$mahnungVerschicken();
        },
        isDisabled: function() {
          return $scope.isExisting() && $scope.rechnung.status !==
            RECHNUNGSTATUS.VERSCHICKT;
        },
        noEntityText: true
      }, {
        label: gettext('Rechnung bezahlt'),
        iconClass: 'fa fa-usd',
        onExecute: function() {
          $scope.rechnungForm.$setPristine();
          return $scope.rechnung.$bezahlen();
        },
        isDisabled: function() {
          return $scope.isExisting() && ($scope.rechnung.status !==
            RECHNUNGSTATUS.VERSCHICKT && $scope.rechnung.status !==
            RECHNUNGSTATUS.MAHNUNG_VERSCHICKT ||
            angular.isUndefined($scope.rechnung.einbezahlterBetrag) ||
            angular.isUndefined($scope.rechnung.eingangsDatum));
        },
        noEntityText: true
      }, {
        label: gettext('Rechnung storniert'),
        iconClass: 'fa fa-times',
        onExecute: function() {
          $scope.rechnung.status = RECHNUNGSTATUS.STORNIERT;
          return $scope.rechnung.$stornieren();
        },
        isDisabled: function() {
          return $scope.isExisting() && $scope.rechnung.status !==
            RECHNUNGSTATUS.VERSCHICKT;
        },
        noEntityText: true
      }, {
        label: gettext('Rechnungsdokument erstellen'),
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.showGenerateRechnungReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.isExisting() ||
            $scope.isExisting() && (
              $scope.rechnung.status === RECHNUNGSTATUS.STORNIERT ||
              $scope.rechnung.status === RECHNUNGSTATUS.BEZAHLT);
        },
        noEntityText: true
      }, {
        label: gettext('Mahnungsdokument erstellen'),
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.showGenerateMahnungReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.isExisting() ||
            $scope.isExisting() && (
              $scope.rechnung.status === RECHNUNGSTATUS.STORNIERT ||
              $scope.rechnung.status === RECHNUNGSTATUS.BEZAHLT);
        },
        noEntityText: true
      }];

      $scope.delete = function() {
        return $scope.rechnung.$delete();
      };

      $scope.closeRechnungBericht = function() {
        $scope.showGenerateRechnungReport = false;
      };

      $scope.closeMahnungBericht = function() {
        $scope.showGenerateMahnungReport = false;
      };

      $scope.closeRechnungBerichtFunct = function() {
        return $scope.closeRechnungBericht;
      };

      $scope.closeMahnungBerichtFunct = function() {
        return $scope.closeMahnungBericht;
      };
    }
  ]);
