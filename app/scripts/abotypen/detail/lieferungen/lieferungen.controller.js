'use strict';

/**
 */
angular.module('openolitor')
  .controller('LieferungenListController', ['$scope', '$routeParams',
    '$location', 'gettext', 'ngTableParams',
    'LieferungenListModel',
    function($scope, $routeParams, $location, gettext, ngTableParams,
      LieferungenListModel) {

      var defaults = {
        model: {}
      };

      $scope.dummyLieferungen = [{
        datum: '31.01.2016',
        anzahlAbwesenheiten: 0,
        anzahlAbos: 135,
        status: 'Geplant'
      }, {
        datum: '15.02.2016',
        anzahlAbwesenheiten: 2,
        anzahlAbos: 130,
        status: 'Offen'
      }, ];

      $scope.lieferungen = undefined;

      $scope.hasLieferungen = function() {
        return $scope.lieferungen !== undefined;
      };

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
    }
  ]);
