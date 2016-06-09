'use strict';

/**
 */
angular.module('openolitor')
  .controller('GuthabenAnpassenController', ['$scope', '$uibModalInstance',
    '$log', 'abo',

    function($scope, $uibModalInstance, $log, abo) {
      $scope.abo = abo;
      $scope.formDaten = {
        guthabenNeu: abo.guthaben,
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
