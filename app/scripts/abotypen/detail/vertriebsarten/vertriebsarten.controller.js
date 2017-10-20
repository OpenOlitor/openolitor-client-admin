'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('VertriebsartenListController', ['$scope', '$routeParams',
    'EnumUtil', 'DataUtil', 'msgBus', 'VertriebeListModel',
    'VertriebsartenListModel', 'DepotsOverviewModel', 'TourenModel',
    'VERTRIEBSARTEN', 'lodash',

    function($scope, $routeParams, EnumUtil, DataUtil,
      msgBus, VertriebeListModel, VertriebsartenListModel,
      DepotsOverviewModel, TourenModel,
      VERTRIEBSARTEN, lodash) {

      $scope.updatingVertrieb = {};
      $scope.status = {
        open: false
      };

      $scope.vertriebsartenTypen = EnumUtil.asArray(VERTRIEBSARTEN);
      $scope.vertriebe = undefined;
      $scope.depotByVertrieb = {};
      $scope.tourenByVertrieb = {};


      var adjustDepotList = function(vertrieb) {
        var selectedDepotIds = (!vertrieb.depotlieferungen) ? [] : vertrieb
          .depotlieferungen.map(
            function(l) {
              return l.depotId;
            });
        $scope.depotByVertrieb[vertrieb.id] = lodash.filter(
          $scope.depots,
          function(depot) {
            return selectedDepotIds.indexOf(depot.id) < 0;
          });
      };

      var adjustTourenList = function(vertrieb) {
        var selectedTourenIds = (!vertrieb.heimlieferungen) ? [] : vertrieb
          .heimlieferungen.map(
            function(l) {
              return l.tourId;
            });
        $scope.tourenByVertrieb[vertrieb.id] = lodash.filter(
          $scope.touren,
          function(tour) {
            return selectedTourenIds.indexOf(tour.id) < 0;
          });
      };

      var adjustDepotAndTourenList = function(vertrieb) {
        adjustDepotList(vertrieb);
        adjustTourenList(vertrieb);
      };

      // get data from backend
      DepotsOverviewModel.query({}, function(depots) {
        $scope.depots = depots;
        if ($scope.vertriebe) {
          lodash.forEach($scope.vertriebe, function(vertrieb) {
            adjustDepotList(vertrieb);
          });
        }
      });
      TourenModel.query({}, function(touren) {
        $scope.touren = touren;
        if ($scope.vertriebe) {
          lodash.forEach($scope.vertriebe, function(vertrieb) {
            adjustTourenList(vertrieb);
          });
        }
      });

      $scope.addVertrieb = function() {
        var newModel = new VertriebeListModel({
          abotypId: parseInt($routeParams.id),
          beschrieb: '',
          liefertag: 'Montag'
        });
        newModel.$save();

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

      $scope.deleteDepotlieferung = function(vertrieb, vertriebsart) {
        if (vertriebsart.id) {
          $scope.updatingVertrieb[vertrieb.id] = true;
          vertriebsart.abotypId = $routeParams.id;
          new VertriebsartenListModel(vertriebsart).$delete(function() {
            var index = vertrieb.depotlieferungen.indexOf(
              vertriebsart);
            if (index > -1) {
              vertrieb.depotlieferungen.splice(index, 1);

              adjustDepotAndTourenList(vertrieb);
            }
          });
        }
      };

      $scope.deleteHeimlieferung = function(vertrieb, vertriebsart) {
        if (vertriebsart.id) {
          $scope.updatingVertrieb[vertrieb.id] = true;
          vertriebsart.abotypId = $routeParams.id;
          new VertriebsartenListModel(vertriebsart).$delete(function() {
            var index = vertrieb.heimlieferungen.indexOf(vertriebsart);
            if (index > -1) {
              vertrieb.heimlieferungen.splice(index, 1);

              adjustDepotAndTourenList(vertrieb);
            }
          });
        }
      };

      $scope.updateVertrieb = function(vertrieb) {
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
          type: 'VertriebSelected',
          vertrieb: $scope.selectedVertrieb
        };
        msgBus.emitMsg(msg);
      };

      $scope.addDepotlieferung = function(depot, vertrieb) {
        var model = {
          abotypId: parseInt($routeParams.id),
          vertriebId: vertrieb.id,
          depotId: depot.id,
          depot: depot,
          typ: VERTRIEBSARTEN.DEPOTLIEFERUNG,
          anzahlAbos: 0
        };

        var newModel = new VertriebsartenListModel(model);
        newModel.$save(function() {
          vertrieb.depotlieferungen.push(model);

          adjustDepotAndTourenList(vertrieb);
        });

        return true;
      };

      $scope.addHeimlieferung = function(tour, vertrieb) {
        var model = {
          abotypId: parseInt($routeParams.id),
          vertriebId: vertrieb.id,
          tourId: tour.id,
          tour: tour,
          typ: VERTRIEBSARTEN.HEIMLIEFERUNG,
          anzahlAbos: 0
        };

        var newModel = new VertriebsartenListModel(model);
        newModel.$save(function() {
          vertrieb.heimlieferungen.push(model);

          adjustDepotAndTourenList(vertrieb);
        });

        return true;
      };

      $scope.addOrRemovePostlieferung = function(vertrieb) {
        if (vertrieb.postlieferungen.length > 0) {
          //remove
          if (vertrieb.postlieferungen[0].anzahlAbos === 0) {
            var modelToDelete = vertrieb.postlieferungen[0];
            modelToDelete.abotypId = $routeParams.id;
            new VertriebsartenListModel(modelToDelete).$delete();
            vertrieb.postlieferungen = [];
          }
        } else {
          //add
          var model = {
            abotypId: parseInt($routeParams.id),
            vertriebId: vertrieb.id,
            typ: VERTRIEBSARTEN.POSTLIEFERUNG,
            anzahlAbos: 0
          };

          var newModel = new VertriebsartenListModel(model);
          newModel.$save(function(savedModel) {
            model.id = savedModel.id;
            vertrieb.postlieferungen.push(model);
          });
        }
      };

      $scope.vertriebClass = function(vertrieb) {
        return ($scope.selectedVertrieb ===
          vertrieb) ? 'active' : '';
      };


      function load() {
        if ($scope.loading) {
          return;
        }

        $scope.loading = true;
        VertriebeListModel.query({
          abotypId: parseInt($routeParams.id)
        }, function(list) {
          $scope.loading = false;
          $scope.vertriebe = list;

          //preload depot and touren filter
          list.map(function(vertrieb) {
            adjustDepotAndTourenList(vertrieb);
          });
        });
      }

      load();
      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (msg.entity === 'Vertrieb') {
          $scope.updatingVertrieb[msg.data.id] = undefined;

          adjustDepotAndTourenList(msg.data);

          var model = msg.data;
          model.heimlieferungen = [];
          model.postlieferungen = [];
          model.depotlieferungen = [];

          $scope.vertriebe.push(new VertriebeListModel(model));

          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity === 'Vertrieb') {
          $scope.updatingVertrieb[msg.data.id] = undefined;

          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (msg.entity === 'Vertrieb') {
          $scope.updatingVertrieb[msg.data.id] = undefined;
          angular.forEach($scope.vertriebe, function(vertrieb) {
            if (vertrieb.id === msg.data.id) {
              var index = $scope.vertriebe.indexOf(
                vertrieb);
              if (index > -1) {
                $scope.vertriebe.splice(index, 1);
              }
            }
          });
          $scope.$apply();
        }
      });
    }
  ]);
