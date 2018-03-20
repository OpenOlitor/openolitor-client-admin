'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('RechnungsPositionenOverviewCreateRechnungenController', ['$scope', '$filter', '$routeParams',
    '$location', '$route', '$uibModal', '$log', '$http', 'gettext',
    'moment', 'EnumUtil', 'DataUtil', 'msgBus', '$q', 'lodash',
    'API_URL', 'alertService', 'AbosOverviewService',

    function($scope, $filter, $routeParams, $location, $route, $uibModal,
      $log, $http, gettext,
      moment, EnumUtil, DataUtil, msgBus, $q, _, API_URL,
      alertService, AbosOverviewService) {

      // rechnungen object with defaults and without ids
      $scope.rechnungen = {
        titel: '',
        rechnungsDatum: new Date(),
        faelligkeitsDatum: new Date(moment().add(1, 'month').subtract(1, 'day').valueOf())
      };

      $scope.getRechnungen = function() {
        $scope.rechnungen.ids = _.map(_.filter($scope.rechnungsPositionen, ['status', 'Offen']), 'id');
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
        $http.post(API_URL + 'rechnungspositionen/aktionen/createrechnungen', $scope.getRechnungen()).then(function() {
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

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        console.log('Mod: ', msg);
        if (msg.entity === 'RechnungsPosition') {
          console.log('RP', msg);
          console.log('$scope.rechnungen.ids', $scope.rechnungen.ids);
          console.log('msg.data.id', msg.data.id);
          if (_.includes($scope.rechnungen.ids, msg.data.id)) {
            console.log('includes', msg.data.id);
            $scope.batchCreated.ids.push(msg.data.id);
            if (!_.includes($scope.batchCreated.rechnungsIds, msg.data.rechnungId)) {
              $scope.batchCreated.rechnungsIds.push(msg.data.rechnungId);
            }
            $scope.$apply();
          }
        }
      });
    }
  ]);
