'use strict';

angular.module('openolitor').directive('ooSaveButton', ['msgBus', function(msgBus) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '@',
      model: '=',
      onSave: '=',
      onCancel: '=',
      form: '='
    },
    transclude: true,
    templateUrl: 'scripts/common/components/oo-savebutton.directive.html',
    controller: function($scope) {
      $scope.isNew = function() {
        return !$scope.model || $scope.model.id === undefined;
      };

      var update = function(src, dest) {
        for (var key in src) {
          if (src.hasOwnProperty(key)) {
            dest[key] = src[key];
          }
        }
      };

      $scope.loading = false;
      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity === $scope.entity && msg.data.id === $scope.model.id) {
          if (!$scope.loading) {
            //TODO: Use alertservice to notify user to reload page before saving
          } else {
            update(msg.data, $scope.model);
            $scope.loading = false;
            $scope.$apply();
          }
        }
      });

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (msg.entity === $scope.entity && msg.data.id === $scope.model.id) {
          update(msg.data, $scope.model);
          $scope.loading = false;
          $scope.$apply();
        }
      });

      $scope.save = function() {
        $scope.loading = true;
        $scope.onSave();
      };

      $scope.cancel = function() {
        $scope.loading = true;
        $scope.onCancel();
      };
    }
  };
}]);
