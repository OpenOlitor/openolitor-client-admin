'use strict';

angular.module('openolitor')
  .directive('ooVertriebsart', ['EnumUtil', 'DepotsOverviewModel',
    'VERTRIEBSARTEN',
    function(
      EnumUtil, DepotsOverviewModel, VERTRIEBSARTEN) {
      return {
        replace: true,
        restrict: 'E',
        scope: {
          vertriebsart: '='
        },
        transclude: true,
        templateUrl: 'scripts/abotypen/detail/vertriebsarten/oo-vertriebsart.html',
        controller: function($scope) {

          // get data from backend
          $scope.depots = DepotsOverviewModel.query({});

          $scope.touren = [];

          $scope.isDepot = function() {
            return $scope.vertriebsart && VERTRIEBSARTEN.DEPOTLIEFERUNG ===
              $scope.vertriebsart.typ;
          };

          $scope.isHeimlieferung = function() {
            return $scope.vertriebsart && VERTRIEBSARTEN.HEIMLIEFERUNG ===
              $scope.vertriebsart.typ;
          };

          $scope.isPreselectionComplete = function() {
            return $scope.vertriebsart && $scope.vertriebsart.typ;
          };
        }
      };
    }
  ]);
