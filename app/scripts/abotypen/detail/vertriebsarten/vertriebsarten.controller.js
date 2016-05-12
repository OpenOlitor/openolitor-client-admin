'use strict';

/**
 */
angular.module('openolitor')
  .controller('VertriebsartenListController', ['$scope', '$routeParams',
    'EnumUtil', 'DataUtil', 'msgBus', 'VertriebeListModel',
    'VertriebsartenListModel', 'DepotsOverviewModel', 'TourenModel',
    'VERTRIEBSARTEN',

    function($scope, $routeParams, EnumUtil, DataUtil,
      msgBus, VertriebeListModel, VertriebsartenListModel, DepotsOverviewModel, TourenModel,
      VERTRIEBSARTEN) {

      $scope.updatingVertrieb = {};
      $scope.status = {
        open: false
      };

      $scope.vertriebsartenTypen = EnumUtil.asArray(VERTRIEBSARTEN);
      $scope.vertriebe = undefined;

      $scope.addVertrieb = function(typ) {
        var newModel = new VertriebeListModel({
          typ: typ.id,
          abotypId: $routeParams.id,
          vertriebsarten: []
        });

        $scope.vertriebe.push(newModel);

        $scope.status.open = false;
      };

      $scope.updatingVertrieb = function(vertrieb) {
        return vertrieb.id && $scope.updatingVertrieb[
          vertrieb.id];
      };

      $scope.deleteVertrieb = function(vertrieb) {
        if (vertrieb.id) {
          $scope.updatingVertrieb[vertrieb.id] = true;
          vertrieb.$delete();
        } else {
          var index = $scope.vertriebe.indexOf(vertrieb);
          if (index > -1) {
            $scope.vertriebe.splice(index, 1);
          }
        }
      };

      $scope.deleteVertriebsart = function(vertrieb, vertriebsart) {
        if (vertriebsart.id) {
          $scope.updatingVertrieb[vertrieb.id] = true;
          vertriebsart.$delete();
        } else {
          var index = vertrieb.vertriebsarten.indexOf(vertriebsart);
          if (index > -1) {
            vertrieb.vertriebsarten.splice(index, 1);
          }
        }
      };

      $scope.invalidVertrieb = function(vertrieb) {
        if (VERTRIEBSARTEN.DEPOTLIEFERUNG === vertrieb.typ || VERTRIEBSARTEN.HEIMLIEFERUNG === vertrieb.typ) {
          return !angular.isDefined(vertrieb.vertriebsarten.length > 0 && vertrieb.liefertag);
        } else {
          return !angular.isDefined(vertrieb.liefertag);
        }
      };

      $scope.updateVertrieb = function(vertrieb) {
        angular.forEach(vertrieb.vertriesarten, function(vertriebsart) {
          vertriebsart.$save();
        });
        $scope.updatingVertrieb[vertrieb.id] = true;
        vertrieb.$save();
      };

      $scope.selectVertrieb = function(vertrieb) {
        if ($scope.selectedVertrieb === vertrieb) {
          $scope.selectedVertrieb = undefined;
        } else {
          $scope.selectedVertrieb = vertrieb;
        }
        var msg = {
          vertriebsart: $scope.selectedVertrieb
        };
        msgBus.emitMsg(msg);
      };

      $scope.addVertriebsartFunc = function() {
        var addVertriebsart = function(vertriebsart, vertrieb) {
          if(vertrieb.vertriebsarten.indexOf(vertriebsart) === -1 ) {
            var newModel = new VertriebsartenListModel({
              typ: vertrieb.typ.id,
              abotypId: $routeParams.id,
              vertriebId: vertrieb.id,
              depot: {name: vertriebsart.name},
              tour: {name: vertriebsart.name}
            });

            vertrieb.vertriebsarten.push(newModel);
          }
          return true; //reset dropdown
        };
        return addVertriebsart;
      };

      $scope.vertriebsartClass = function(vertriebsart) {
        return ($scope.selectedVertrieb ===
          vertriebsart) ? 'active' : '';
      };


      function load() {
        if ($scope.loading) {
          return;
        }

        $scope.loading = true;
        $scope.vertriebe = VertriebeListModel.query({
          abotypId: $routeParams.id
        }, function(vertriebe) {
          angular.forEach(vertriebe, function(vertrieb) {
            vertrieb.vertriebsarten = VertriebsartenListModel.query({
              abotypId: $routeParams.id,
              vertriebId: vertrieb.id
            }, function(vertriebsarten) {
              if(vertriebsarten.length > 0) {
                vertrieb.typ = vertriebsarten[0].typ;
              }
              $scope.loading = false;
            });
          });
        });
      }

      load();

      var isEntity = function(entity) {
        return (entity === 'Depotlieferung' || entity === 'Postlieferung' ||
          entity === 'Heimlieferung' || entity === 'Vertieb');
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

      $scope.isPreselectionComplete = function(vertrieb) {
        return vertrieb && vertrieb.typ;
      };

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (isEntity(msg.entity)) {
          $scope.updatingVertrieb[msg.data.id] = undefined;

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
          $scope.updatingVertrieb[msg.data.id] = undefined;

          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (isEntity(msg.entity)) {
          $scope.updatingVertrieb[msg.data.id] = undefined;
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
