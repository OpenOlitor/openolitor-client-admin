'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('VertriebsartAnpassenController', ['$scope', '$uibModalInstance',
    '$log', 'abo', 'vertriebe', 'vertriebsarten',

    function($scope, $uibModalInstance, $log, abo, vertriebe, vertriebsarten) {
      $scope.abo = abo;
      $scope.vertriebe = vertriebe;

      $scope.vertriebsarten = vertriebsarten;
      $scope.formDaten = {
        vertriebsartIdNeu: undefined,
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
