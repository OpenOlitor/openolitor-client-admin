'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('RechnungenDetailController', ['$scope', '$rootScope', '$filter',
    '$routeParams', '$http',
    '$location', '$uibModal', 'gettext', 'RechnungenDetailModel',
    'EnumUtil', 'API_URL', 'msgBus', '$log', 'moment', 'KundenOverviewModel',
    'KundenDetailModel',
    'RECHNUNGSTATUS', 'FileUtil', 'DataUtil',
    function($scope, $rootScope, $filter, $routeParams, $http, $location,
      $uibModal,
      gettext,
      RechnungenDetailModel, EnumUtil, API_URL,
      msgBus, $log, moment, KundenOverviewModel, KundenDetailModel,
      RECHNUNGSTATUS, FileUtil, DataUtil) {

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

      $scope.loading = false;

      function getAboEntry(abo) {
        return {
          id: abo.id,
          label: '' + abo.abotypName + ' (' + abo.id + ')'
        };
      }

      function resolveKunde(id) {
        return KundenDetailModel.get({
          id: id
        }, function(kunde) {
          $scope.kunde = kunde;
          $scope.rechnung.kundeId = kunde.id;
          $scope.rechnung.bezeichnung = kunde.bezeichnung;
          $scope.rechnung.strasse = kunde.strasse;
          $scope.rechnung.hausNummer = kunde.hausNummer;
          $scope.rechnung.adressZusatz = kunde.adressZusatz;
          $scope.rechnung.plz = kunde.plz;
          $scope.rechnung.ort = kunde.ort;

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
          return kunden;
        });
      };

      $scope.loadRechnung = function() {
        RechnungenDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.rechnung = result;
          resolveKunde(result.kunde.id);
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
        resolveKunde($routeParams.kundeId).then(function() {
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
        if (msg.entity === 'Rechnung') {
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
        return $scope.rechnung.$save();
      };

      $scope.created = function(id) {
        $location.path('/rechnungen/' + id);
      };

      $scope.backToList = function() {
        $location.path('/rechnungen');
      };

      $scope.canEdit = function() {
        return !$scope.isExisting() ||
          $scope.rechnung.status === RECHNUNGSTATUS.ERSTELLT ||
          $scope.rechnung.status === RECHNUNGSTATUS.VERSCHICKT;
      };

      $scope.downloadRechnung = function() {
        $scope.isDownloading = true;
        FileUtil.downloadGet('rechnungen/' + $scope.rechnung.id +
          '/aktionen/download', 'Rechnung ' + $scope.rechnung.id,
          'application/pdf',
          function() {
            $scope.isDownloading = false;
          });
      };

      $scope.actions = [{
        labelFunction: function() {
          if ($scope.isExisting()) {
            return 'speichern';
          } else {
            return 'erstellen';
          }
        },
        onExecute: function() {
          return $scope.rechnung.$save();
        }
      }, {
        label: 'verschickt',
        iconClass: 'fa fa-exchange',
        onExecute: function() {
          return $scope.rechnung.$verschicken();
        },
        isDisabled: function() {
          return $scope.isExisting() && $scope.rechnung.status !==
            RECHNUNGSTATUS.ERSTELLT;
        }
      }, {
        label: 'Email versand*',
        iconClass: 'fa fa-envelope-o',
        onExecute: function() {
          return false;
        },
        isDisabled: function() {
          return true;
        },
        noEntityText: true
      }, {
        label: 'Mahnung verschickt',
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
        label: 'bezahlt',
        iconClass: 'fa fa-usd',
        onExecute: function() {
          return $scope.rechnung.$bezahlen();
        },
        isDisabled: function() {
          return $scope.isExisting() && ($scope.rechnung.status !==
            RECHNUNGSTATUS.VERSCHICKT && $scope.rechnung.status !==
            RECHNUNGSTATUS.MAHNUNG_VERSCHICKT ||
            angular.isUndefined($scope.rechnung.einbezahlterBetrag) ||
            angular.isUndefined($scope.rechnung.eingangsDatum));
        }
      }, {
        label: 'storniert',
        iconClass: 'fa fa-times',
        onExecute: function() {
          $scope.rechnung.status = RECHNUNGSTATUS.STORNIERT;
          return $scope.rechnung.$stornieren();
        },
        isDisabled: function() {
          return $scope.isExisting() && $scope.rechnung.status !==
            RECHNUNGSTATUS.VERSCHICKT;
        }
      }, {
        label: 'Dokument erstellen',
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.showGenerateReport = true;
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

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };
    }
  ]);
