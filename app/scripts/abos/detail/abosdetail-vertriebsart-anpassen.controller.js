'use strict';

/**
 */
angular.module('openolitor')
  .controller('VertriebsartAnpassenController', ['$scope', '$uibModalInstance',
    '$log', 'abo', 'vertriebsarten',

    function($scope, $uibModalInstance, $log, abo, vertriebsarten) {
      $scope.abo = abo;
      $scope.vertriebsarten = vertriebsarten;
      $scope.formDaten = {
        vertriebsartId: undefined,
        bemerkung: undefined
      };

      $scope.ok = function() {
        $uibModalInstance.close($scope.formDaten);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    }
  ]);
