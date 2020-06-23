'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('VertriebsartAnpassenController', ['$scope', '$uibModalInstance',
    '$log', 'abo', 'vertriebe', 'vertriebsarten', 'lodash',

    function($scope, $uibModalInstance, $log, abo, vertriebe, vertriebsarten,
      lodash) {
      $scope.abo = abo;
      $scope.vertriebe = vertriebe;
      $scope.vertriebsarten = vertriebsarten;

      var findWithId = function(array, id) {
        var found;
        lodash.forEach(array, function(elem) {
          if(angular.isDefined(elem.id) && elem.id === id) {
            found = elem.id;
          }
        });
        return found;
      };

      $scope.formDaten = {
        vertriebIdNeu: findWithId(vertriebe, abo.vertriebId),
        vertriebsartIdNeu: findWithId(vertriebsarten[abo.vertriebId], abo.vertriebsartId),
        bemerkung: undefined
      };

      $scope.vertriebChanged = function() {
        $scope.formDaten.vertriebsartIdNeu = undefined;
      };

      $scope.vertriebChangedFunc = function() {
        return $scope.vertriebChanged;
      };

      $scope.ok = function() {
        $uibModalInstance.close($scope.formDaten);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    }
  ]);
