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
      controller: function($scope, ngTableParams) {
        $scope.showAllAbwesenheiten = false;
        $scope.deletingAbwesenheit = {};

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
          //TODO:
        };

        if (!$scope.abwesenheitTableParams) {
          //use default tableParams
          $scope.abwesenheitTableParams = new ngTableParams({ // jshint ignore:line
            counts: [],
            sorting: {
              datum: 'asc'
            }
          }, {
            getData: function($defer, params) {
              if (!$scope.abo || !$scope.abo.abwesenheiten) {
                return;
              }
              params.total($scope.abo.abwesenheiten.length);
              $defer.resolve($scope.abo.abwesenheiten);
            }

          });
        }
      }
    };
  }
]);
