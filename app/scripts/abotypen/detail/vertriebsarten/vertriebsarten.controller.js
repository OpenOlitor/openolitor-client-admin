'use strict';

/**
 */
angular.module('openolitor')
  .controller('VertriebsartenListController', ['$scope', '$routeParams',
    'EnumUtil', 'DataUtil', 'msgBus',
    'VertriebsartenListModel', 'DepotsOverviewModel', 'TourenModel',
    'VERTRIEBSARTEN',

    function($scope, $routeParams, EnumUtil, DataUtil,
      msgBus, VertriebsartenListModel, DepotsOverviewModel, TourenModel,
      VERTRIEBSARTEN) {

      $scope.updatingVertriebsart = {};
      $scope.status = {
        open: false
      };

      $scope.vertriebsartenTypen = EnumUtil.asArray(VERTRIEBSARTEN);
      $scope.vertriebsarten = undefined;

      $scope.addVertriebsart = function(typ) {
        var newModel = new VertriebsartenListModel({
          typ: typ.id,
          abotypId: $routeParams.id
        });

        $scope.vertriebsarten.push(newModel);

        $scope.status.open = false;
      };

      $scope.updatingVertriebsart = function(vertriebsart) {
        return vertriebsart.id && $scope.updatingVertriebsart[
          vertriebsart.id];
      };

      $scope.deleteVertriebsart = function(vertriebsart) {
        if (vertriebsart.id) {
          $scope.updatingVertriebsart[vertriebsart.id] = true;
          vertriebsart.$delete();
        } else {
          var index = $scope.vertriebsarten.indexOf(vertriebsart);
          if (index > -1) {
            $scope.vertriebsarten.splice(index, 1);
          }
        }
      };

      $scope.invalidVertriebsart = function(vertriebsart) {
        if (VERTRIEBSARTEN.DEPOTLIEFERUNG === vertriebsart.typ) {
          return !angular.isDefined(vertriebsart.depotId && vertriebsart.liefertag);
        } else if (VERTRIEBSARTEN.HEIMLIEFERUNG === vertriebsart.typ) {
          return !angular.isDefined(vertriebsart.tourId && vertriebsart.liefertag);
        } else {
          return !angular.isDefined(vertriebsart.liefertag);
        }
      };

      $scope.updateVertriebsart = function(vertriebsart) {
        $scope.updatingVertriebsart[vertriebsart.id] = true;
        vertriebsart.$save();
      };

      $scope.selectVertriebsart = function(vertriebsart) {
        if ($scope.selectedVertriebsart === vertriebsart) {
          $scope.selectedVertriebsart = undefined;
        } else {
          $scope.selectedVertriebsart = vertriebsart;
        }
        var msg = {
          type: 'VertriebsartSelected',
          vertriebsart: $scope.selectedVertriebsart
        };
        msgBus.emitMsg(msg);
      };

      $scope.vertriebsartClass = function(vertriebsart) {
        return ($scope.selectedVertriebsart ===
          vertriebsart) ? 'active' : '';
      };


      function load() {
        if ($scope.loading) {
          return;
        }

        $scope.loading = true;
        $scope.vertriebsarten = VertriebsartenListModel.query({
          abotypId: $routeParams.id
        }, function() {
          $scope.loading = false;
        });
      }

      load();

      var isEntity = function(entity) {
        return (entity === 'Depotlieferung' || entity === 'Postlieferung' ||
          entity === 'Heimlieferung');
      };

      // get data from backend
      $scope.depots = DepotsOverviewModel.query({});

      $scope.touren = TourenModel.query({});

      $scope.isDepot = function(vertriebsart) {
        return vertriebsart && VERTRIEBSARTEN.DEPOTLIEFERUNG ===
          vertriebsart.typ;
      };

      $scope.isHeimlieferung = function(vertriebsart) {
        return vertriebsart && VERTRIEBSARTEN.HEIMLIEFERUNG ===
          vertriebsart.typ;
      };

      $scope.isPreselectionComplete = function(vertriebsart) {
        return vertriebsart && vertriebsart.typ;
      };

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (isEntity(msg.entity)) {
          $scope.updatingVertriebsart[msg.data.id] = undefined;

          //load vertriebsart from remote, we don't get full model within event
          var newVertriebsart = VertriebsartenListModel.get({
            id: msg.data.id,
            abotypId: $routeParams.id
          }, function() {
            angular.forEach($scope.vertriebsarten, function(
              vertriebsart) {
              if (vertriebsart.id === msg.data.id) {
                DataUtil.update(newVertriebsart, vertriebsart);
              }
            });
          });


          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (isEntity(msg.entity)) {
          $scope.updatingVertriebsart[msg.data.id] = undefined;

          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (isEntity(msg.entity)) {
          $scope.updatingVertriebsart[msg.data.id] = undefined;
          angular.forEach($scope.vertriebsarten, function(
            vertriebsart) {
            if (vertriebsart.id === msg.data.id) {
              var index = $scope.vertriebsarten.indexOf(
                vertriebsart);
              if (index > -1) {
                $scope.vertriebsarten.splice(index, 1);
              }
            }
          });

          $scope.$apply();
        }
      });
    }
  ]);
