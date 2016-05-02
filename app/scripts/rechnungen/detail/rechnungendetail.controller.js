'use strict';

/**
 */
angular.module('openolitor')
  .controller('RechnungenDetailController', ['$scope', '$rootScope', '$filter',
    '$routeParams', '$http',
    '$location', '$uibModal', 'gettext', 'RechnungenDetailModel',
    'EnumUtil', 'API_URL', 'msgBus', '$log', 'moment', 'KundenOverviewModel', 'KundenDetailModel', 'AbosOverviewModel',
    'RECHNUNGSTATUS',
    function($scope, $rootScope, $filter, $routeParams, $http, $location, $uibModal,
      gettext,
      RechnungenDetailModel, EnumUtil, API_URL,
      msgBus, $log, moment, KundenOverviewModel, KundenDetailModel, AbosOverviewModel, RECHNUNGSTATUS) {

      var defaults = {
        model: {
          id: undefined,
          waehrung: 'CHF',
          rechnungsDatum: new Date(),
          faelligkeitsDatum: new Date(moment().add(1, 'month').subtract(1, 'day').valueOf()),
          status: RECHNUNGSTATUS.ERSTELLT
        }
      };

      $scope.loading = false;

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

      function resolveAbo(id) {
        AbosOverviewModel.get({
          id: id
        }, function(abo) {
          $scope.abo = abo;
          $scope.rechnung.aboId = abo.id;
        });
      }

      $scope.loadRechnung = function() {
        RechnungenDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.rechnung = result;
          resolveKunde(result.kunde.id);
          $scope.abo = result.abo;
          $scope.rechnung.aboId = result.abo.id;
        });
      };

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
        });
      }

      if (!$routeParams.id) {
        $scope.rechnung = new RechnungenDetailModel(defaults.model);
        $scope.pendenzen = [];
      } else {
        $scope.loadRechnung();
      }

      if (!$routeParams.kundeId) {
        $scope.kunde = undefined;
      } else {
        resolveKunde($routeParams.kundeId);
      }

      if (!$routeParams.aboId) {
        $scope.abo = undefined;
      } else {
        resolveAbo($routeParams.aboId);
      }

      $scope.selectedAbo = function(abo) {
        $scope.rechnung.aboId = abo.id;
        $scope.abo = abo;
        return false;
      };

      $scope.aboLabel = function(abo) {
        if (!abo) {
          return 'nothing here';
        }

        return abo.abotypName + ', ' + abo.depotName;
      };

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Rechnung') {
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
        return angular.isDefined($scope.rechnung) && angular.isDefined($scope.rechnung
          .id);
      };

      $scope.isVerschickt = function() {
        return $scope.isExisting() && $scope.rechnung.status === RECHNUNGSTATUS.VERSCHICKT;
      };

      $scope.isDeletable = function() {
        return $scope.isExisting() && $scope.rechnung.status === RECHNUNGSTATUS.ERSTELLT;
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
        label: 'verschicken',
        iconClass: 'fa fa-envelope-o',
        onExecute: function() {
          return $scope.rechnung.$verschicken();
        },
        isDisabled: function() {
          return $scope.isExisting() && $scope.rechnung.status !== RECHNUNGSTATUS.ERSTELLT;
        }
      }, {
        label: 'Mahnung verschicken',
        iconClass: 'fa fa-exclamation',
        onExecute: function() {
          return $scope.rechnung.$mahnungVerschicken();
        },
        isDisabled: function() {
          return $scope.isExisting() && $scope.rechnung.status !== RECHNUNGSTATUS.VERSCHICKT;
        },
        noEntityText: true
      }, {
        label: 'bezahlen',
        iconClass: 'fa fa-usd',
        onExecute: function() {
          return $scope.rechnung.$bezahlen();
        },
        isDisabled: function() {
          return $scope.isExisting() && ($scope.rechnung.status !== RECHNUNGSTATUS.VERSCHICKT && $scope.rechnung.status !== RECHNUNGSTATUS.MAHNUNG_VERSCHICKT);
        }
      }, {
        label: 'stornieren',
        iconClass: 'fa fa-times',
        onExecute: function() {
          $scope.rechnung.status = RECHNUNGSTATUS.STORNIERT;
          return $scope.rechnung.$stornieren();
        },
        isDisabled: function() {
          return $scope.isExisting() && $scope.rechnung.status !== RECHNUNGSTATUS.VERSCHICKT;
        }
      }];

      $scope.delete = function() {
        return $scope.rechnung.$delete();
      };
    }
  ]);
