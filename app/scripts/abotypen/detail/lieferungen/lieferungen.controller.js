'use strict';

/**
 */
angular.module('openolitor')
  .controller('LieferungenListController', ['$scope', '$routeParams',
    '$location', 'gettext', 'ngTableParams', 'msgBus',
    'LieferungenListModel', 'LIEFERSTATUS',

    function($scope, $routeParams, $location, gettext, ngTableParams,
      msgBus, LieferungenListModel, LIEFERSTATUS) {

      var defaults = {
        model: {}
      };

      $scope.now = new Date();
      $scope.template = {};
      $scope.deletingLieferung = {};
      $scope.status = {
        open: false
      }

      $scope.dummyLieferungen = [{
        datum: '31.01.2016',
        anzahlAbwesenheiten: 0,
        anzahlAbos: 135,
        status: LIEFERSTATUS.INBEARBEITUNG
      }, {
        datum: '15.02.2016',
        anzahlAbwesenheiten: 2,
        anzahlAbos: 130,
        status: LIEFERSTATUS.OFFEN
      }, ];

      $scope.lieferungen = undefined;

      $scope.hasLieferungen = function() {
        return $scope.lieferungen !== undefined;
      };

      $scope.addLieferung = function() {
        if ($scope.datumExistiert($scope.template.datum)) {
          return;
        }
        var newModel = new LieferungenListModel({
          datum: $scope.template.datum,
          abotypId: $routeParams.id
        });
        newModel.$save();
        $scope.template.creating = true;
        $scope.template.datum = undefined;
        $scope.status.open = false;
      };

      $scope.datumExistiert = function(datum) {
        //first check if date if not yet part of the list of lieferdat. Lieferdat must be unique
        var result = false;
        angular.forEach($scope.lieferungen, function(lieferung) {
          if (lieferung.datum.toDateString() === datum.toDateString()) {
            result = true;
            return;
          }
        });
        return result;
      };

      $scope.deletingLieferung = function(lieferung) {
        return $scope.deletingLieferung[lieferung.id];
      };

      $scope.deleteLieferung = function(lieferung) {
        $scope.deletingLieferung[lieferung.id] = true;
        lieferung.$delete();
      }

      if (!$scope.lieferungenTableParams) {
        //use default tableParams
        $scope.lieferungenTableParams = new ngTableParams({ // jshint ignore:line
          counts: [],
          sorting: {
            name: 'asc'
          }
        }, {
          getData: function($defer, params) {
            if (!$scope.lieferungen) {
              return;
            }
            params.total($scope.lieferungen.length);
            $defer.resolve($scope.lieferungen);
          }

        });
      }

      function load() {
        if ($scope.loading) {
          return;
        }

        $scope.loading = true;
        $scope.lieferungen = LieferungenListModel.query({
          abotypId: $routeParams.id
        }, function() {
          $scope.lieferungenTableParams.reload();
          $scope.loading = false;
        });
      }

      load();

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (msg.entity === 'Lieferung') {
          $scope.template.creating = undefined;

          $scope.lieferungen.push(new LieferungenListModel(msg.data));
          $scope.lieferungenTableParams.reload();

          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (msg.entity === 'Lieferung') {
          $scope.template.deleting = undefined;
          $scope.deletingLieferung[msg.data.id] = undefined;
          angular.forEach($scope.lieferungen, function(lieferung) {
            if (lieferung.id === msg.data.id) {
              var index = $scope.lieferungen.indexOf(lieferung)
              if (index > -1) {
                $scope.lieferungen.splice(index, 1);
              }
            }
          })

          $scope.lieferungenTableParams.reload();
          $scope.$apply();
        }
      });
    }
  ]);
