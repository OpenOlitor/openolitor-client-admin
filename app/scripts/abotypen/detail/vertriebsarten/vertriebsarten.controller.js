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
          abotypId: parseInt($routeParams.id),
          beschrieb: '',
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
          if(!vertriebsart.isNew) {
            vertriebsart.$delete();
          }
        } else {
          var index = vertrieb.vertriebsarten.indexOf(vertriebsart);
          if (index > -1) {
            vertrieb.vertriebsarten.splice(index, 1);
          }
        }
      };

      $scope.invalidVertrieb = function(vertrieb) {
        if (VERTRIEBSARTEN.DEPOTLIEFERUNG === vertrieb.typ || VERTRIEBSARTEN.HEIMLIEFERUNG === vertrieb.typ) {
          return vertrieb.vertriebsarten.length === 0 || !angular.isDefined(vertrieb.liefertag);
        } else {
          return !angular.isDefined(vertrieb.liefertag);
        }
      };

      $scope.updateVertrieb = function(vertrieb) {
        $scope.updatingVertrieb[vertrieb.id] = true;
        var vertriebsarten = vertrieb.vertriebsarten;
        vertrieb.$save(function(result) {
          vertrieb.vertriebsarten = vertriebsarten;
          angular.forEach(vertrieb.vertriebsarten, function(vertriebsart) {
            vertriebsart.isNew = undefined;
            vertriebsart.vertriebId = result.id;
            vertriebsart.$save();
          });
        });
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

            var model = {
              typ: vertrieb.typ,
              abotypId: parseInt($routeParams.id),
              vertriebId: vertrieb.id,
              isNew: true
            };

            if($scope.isDepot(vertrieb)) {
              model.depot = {name: vertriebsart.name};
              model.depotId = vertriebsart.id;
            }

            if($scope.isHeimlieferung(vertrieb)) {
              model.tour = {name: vertriebsart.name};
              model.tourId = vertriebsart.id;
            }

            var newModel = new VertriebsartenListModel(model);

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
          abotypId: parseInt($routeParams.id)
        }, function(vertriebe) {
          angular.forEach(vertriebe, function(vertrieb) {
            vertrieb.vertriebsarten = VertriebsartenListModel.query({
              abotypId: parseInt($routeParams.id),
              vertriebId: vertrieb.id
            }, function(vertriebsarten) {
              if(vertriebsarten.length > 0) {
                vertrieb.typ = vertriebsarten[0].typ;
              }
              angular.forEach(vertriebsarten, function(vertriebsart) {
                vertriebsart.abotypId = parseInt($routeParams.id);
              });
              $scope.loading = false;
            });
          });
        });
      }

      load();

      var isEntity = function(entity) {
        return (entity === 'Depotlieferung' || entity === 'Postlieferung' ||
          entity === 'Heimlieferung' || entity === 'Vertrieb');
      };

      // get data from backend
      $scope.depots = DepotsOverviewModel.query({});

      $scope.touren = TourenModel.query({});

      $scope.isDepot = function(vertrieb) {
        return vertrieb && VERTRIEBSARTEN.DEPOTLIEFERUNG ===
          vertrieb.typ;
      };

      $scope.isHeimlieferung = function(vertrieb) {
        return vertrieb && VERTRIEBSARTEN.HEIMLIEFERUNG ===
          vertrieb.typ;
      };

      $scope.isPreselectionComplete = function(vertrieb) {
        return vertrieb && vertrieb.typ;
      };

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (isEntity(msg.entity)) {
          $scope.updatingVertrieb[msg.data.id] = undefined;
          $scope.updatingVertrieb[msg.data.vertriebId] = undefined;

          //load vertriebsart from remote, we don't get full model within event
          if(!angular.isUndefined(msg.data.vertriebId)) {
            var newVertriebsart = VertriebsartenListModel.get({
              id: msg.data.id,
              abotypId: parseInt($routeParams.id),
              vertriebId: msg.data.vertriebId
            }, function() {
              angular.forEach($scope.vertriebe, function(vertrieb) {
                angular.forEach(vertrieb.vertriebsarten, function(vertriebsart) {
                  if (vertriebsart.id === msg.data.id) {
                    DataUtil.update(newVertriebsart, vertriebsart);
                  }
                });
              });
            });
          } else {
            load();
          }

          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (isEntity(msg.entity)) {
          $scope.updatingVertrieb[msg.data.id] = undefined;
          $scope.updatingVertrieb[msg.data.vertriebId] = undefined;

          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (isEntity(msg.entity)) {
          $scope.updatingVertrieb[msg.data.id] = undefined;
          $scope.updatingVertrieb[msg.data.vertriebId] = undefined;
          angular.forEach($scope.vertriebe, function(vertrieb) {
            if (vertrieb.id === msg.data.id) {
              var index = $scope.vertriebe.indexOf(
                vertrieb);
              if (index > -1) {
                $scope.vertriebe.splice(index, 1);
              }
            }

            angular.forEach(vertrieb.vertriebsarten, function(vertriebsart) {
              if (vertriebsart.id === msg.data.id) {
                var index = vertrieb.vertriebsarten.indexOf(
                  vertriebsart);
                if (index > -1) {
                  vertrieb.vertriebsarten.splice(index, 1);
                }
              }
            });
          });

          $scope.$apply();
        }
      });
    }
  ]);
