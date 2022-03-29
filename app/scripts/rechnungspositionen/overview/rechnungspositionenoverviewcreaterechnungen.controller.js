'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('RechnungsPositionenOverviewCreateRechnungenController', ['$scope', '$filter', '$routeParams',
    '$location', '$route', '$uibModal', '$log', '$http', 'gettext',
    'moment', 'EnumUtil', 'DataUtil', 'msgBus', '$q', 'lodash',
    'appConfig', 'alertService', 'AbosOverviewService',

    function($scope, $filter, $routeParams, $location, $route, $uibModal,
      $log, $http, gettext,
      moment, EnumUtil, DataUtil, msgBus, $q, lodash, appConfig,
      alertService, AbosOverviewService) {

      // rechnungen object with defaults and without ids
      $scope.rechnungen = {
        titel: '',
        rechnungsDatum: new Date(),
        faelligkeitsDatum: new Date(moment().add(1, 'month').subtract(1, 'day').valueOf())
      };

      $scope.getRechnungen = function() {
        $scope.rechnungen.ids = lodash.map(lodash.filter($scope.rechnungsPositionen, ['status', 'Offen']), 'id');
        return $scope.rechnungen;
      };

      $scope.form = {
        mode: 'AnzahlLieferungen',
        manuellerBetrag: false
      };


      $scope.commandIssued = false;

      $scope.open = {
        start: false
      };

      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      $scope.batchCreate = function() {
        $http.post(appConfig.get().API_URL + 'rechnungspositionen/aktionen/createrechnungen', $scope.getRechnungen()).then(function() {
          $scope.commandIssued = true;
        });
      };

      $scope.jumpToRechnungen = function() {
        $location.path('/rechnungen').search('q', 'id=' + $scope.batchCreated.rechnungsIds.join());
      };

      $scope.batchCreated = {
        ids: [],
        rechnungsIds: [],
        rechnungsPositionenInWrongState: []
      };

      $scope.numberOfOpenRechnungPositionen = function(rechnungPositionenList){
          var result = 0;
          lodash.forEach(rechnungPositionenList, function(rechnungPosition){
              if (rechnungPosition.status === 'Offen'){
                  result++;
              }
          });
          return result;
      }

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        console.log('Mod: ', msg);
        if (msg.entity === 'RechnungsPosition') {
          console.log('RP', msg);
          console.log('$scope.rechnungen.ids', $scope.rechnungen.ids);
          console.log('msg.data.id', msg.data.id);
          if (lodash.includes($scope.rechnungen.ids, msg.data.id)) {
            console.log('includes', msg.data.id);
            $scope.batchCreated.ids.push(msg.data.id);
            if (!lodash.includes($scope.batchCreated.rechnungsIds, msg.data.rechnungId)) {
              $scope.batchCreated.rechnungsIds.push(msg.data.rechnungId);
            }
            $scope.$apply();
          }
        }
      });
    }
  ]);
