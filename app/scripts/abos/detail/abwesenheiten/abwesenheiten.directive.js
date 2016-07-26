'use strict';

angular.module('openolitor-admin').directive('ooAboAbwesenheiten', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        abo: '='
      },
      transclude: true,
      templateUrl: 'scripts/abos/detail/abwesenheiten/abwesenheiten.html',
      controller: function($scope, NgTableParams, AbwesenheitenListModel,
        msgBus, lodash) {
        $scope.showAllAbwesenheiten = false;
        $scope.deletingAbwesenheit = {};
        $scope.template = {
          creating: 0
        };

        $scope.abwesenheitsDaten = function() {
          if (!$scope.abwesenheiten) {
            return [];
          }
          return $scope.abwesenheiten.map(function(i) {
            return i.lieferungId;
          });
        };

        $scope.deletingAbwesenheit = function(abw) {
          return $scope.deletingAbwesenheit[abw.id];
        };

        $scope.deleteAbwesenheit = function(abw) {
          $scope.deletingAbwesenheit[abw.id] = true;
          abw.$delete();
        };

        $scope.addAbwesenheit = function(lieferung) {
          var newModel = new AbwesenheitenListModel({
            datum: lieferung.datum,
            lieferungId: lieferung.id,
            aboId: $scope.abo.id,
            kundeId: $scope.abo.kundeId
          });
          newModel.$save();
          $scope.template.creating = $scope.template.creating + 1;
        };

        $scope.showLoading = function() {
          return $scope.loading || $scope.template.creating > 0;
        };

        var unwatch = $scope.$watch('abo', function(abo) {
          if (abo) {
            $scope.abwesenheiten = $scope.abo.abwesenheiten.map(
              function(abw) {
                abw.kundeId = $scope.abo.kundeId;
                return new AbwesenheitenListModel(abw);
              });
            if ($scope.abwesenheitenTableParams) {
              $scope.abwesenheitenTableParams.reload();
            }
          }
        });
        $scope.$on('destroy', function() {
          unwatch();
        });

        $scope.isLieferungOpen = function(abw) {
          var lieferung = lodash.filter($scope.abo.lieferdaten,
            function(l) {
              return l.id === abw.lieferungId;
            });
          return lieferung && lieferung.length === 1 && !lieferung[0].lieferplaningId;
        };

        if (!$scope.abwesenheitenTableParams) {
          //use default tableParams
          $scope.abwesenheitenTableParams = new NgTableParams({ // jshint ignore:line
            counts: [],
            sorting: {
              datum: 'asc'
            }
          }, {
            getData: function(params) {
              if (!$scope.abwesenheiten) {
                return;
              }
              params.total($scope.abwesenheiten.length);
              return $scope.abwesenheiten;
            }

          });
        }

        msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
          if (msg.entity === 'Abwesenheit') {
            $scope.template.creating = $scope.template.creating - 1;
            msg.data.kundeId = $scope.abo.kundeId;
            $scope.abwesenheiten.push(new AbwesenheitenListModel(msg.data));

            $scope.$apply();
          }
        });

        msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
          if (msg.entity === 'Abwesenheit') {
            $scope.deletingAbwesenheit[msg.data.id] = undefined;

            angular.forEach($scope.abwesenheiten, function(
              abw) {
              if (abw.id === msg.data.id) {
                var index = $scope.abwesenheiten.indexOf(
                  abw);
                if (index > -1) {
                  $scope.abwesenheiten.splice(index, 1);
                }
              }
            });

            $scope.$apply();
          }
        });
      }
    };
  }
]);
