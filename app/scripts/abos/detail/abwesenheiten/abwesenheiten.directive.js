'use strict';

angular.module('openolitor').directive('ooAboAbwesenheiten', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        abo: '='
      },
      transclude: true,
      templateUrl: 'scripts/abos/detail/abwesenheiten/abwesenheiten.html',
      controller: function($scope, ngTableParams, AbwesenheitenListModel,
        msgBus, lodash) {
        $scope.showAllAbwesenheiten = false;
        $scope.deletingAbwesenheit = {};
        $scope.template = {
          creating: 0
        };

        $scope.abwesenheitsDaten = function() {
          if (!$scope.abo || !$scope.abo.abwesenheiten) {
            return [];
          }
          return $scope.abo.abwesenheiten.map(function(i) {
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
          var lieferung = lodash.filter($scope.abo.lieferungen,
            function(l) {
              return l.id === abw.lieferungId;
            })
          return lieferung && lieferung.status === 'Offen';
        };

        if (!$scope.abwesenheitenTableParams) {
          //use default tableParams
          $scope.abwesenheitenTableParams = new ngTableParams({ // jshint ignore:line
            counts: [],
            sorting: {
              datum: 'asc'
            }
          }, {
            getData: function($defer, params) {
              if (!$scope.abwesenheiten) {
                return;
              }
              params.total($scope.abwesenheiten.length);
              $defer.resolve($scope.abwesenheiten);
            }

          });
        }

        msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
          if (msg.entity === 'Abwesenheit') {
            $scope.template.creating = $scope.template.creating - 1;
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
                var index = $scope.vertriebsarten.indexOf(
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
