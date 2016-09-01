'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('BestellungDetailController', ['$scope', 'lodash',
    'LieferantenAbrechnungenOverviewModel',

    function($scope, lodash, LieferantenAbrechnungenOverviewModel) {
        var loadDetail = function() {
            LieferantenAbrechnungenOverviewModel.get({
            id: $scope.bestellungId
          }, function(bestellung) {
            $scope.bestellung = bestellung;
          });
        };

        var unwatchId = $scope.$watch('bestellungId', function(id) {
          if (id && (!$scope.bestellung || $scope.bestellung.id !== id)) {
            loadDetail();
          }
        });

        $scope.$on('destroy', function() {
          unwatchId();
        });
    }
  ]);
