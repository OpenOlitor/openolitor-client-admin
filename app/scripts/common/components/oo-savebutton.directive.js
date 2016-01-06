'use strict';

angular.module('openolitor').directive('ooSaveButton', ['msgBus', 'gettext', 'alertService', function(msgBus, gettext, alertService) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '@',
      model: '=',
      onSave: '=',
      onCancel: '=',
      form: '=',
      onCreated: '='
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

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity === $scope.entity && msg.data.id === $scope.model.id) {
          if ($scope.model.actionInProgress !== 'updating') {
            alertService.addAlert('info', gettext($scope.entity + ' wurde durch eine andere Person geändert. Bitte laden Sie die Ansicht neu.'));
          } else {
            update(msg.data, $scope.model);
            $scope.model.actionInProgress = undefined;
            $scope.$apply();
          }
        }
      });

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if ($scope.model && msg.entity === $scope.entity && msg.data.id === $scope.model.id) {
          update(msg.data, $scope.model);
          $scope.model.actionInProgress = undefined;
          if ($scope.onCreated) {
            $scope.onCreated(msg.data.id);
          }
          $scope.$apply();
        }
      });

      $scope.save = function() {
        $scope.model.actionInProgress = 'updating';
        $scope.onSave();
      };

      $scope.cancel = function() {
        $scope.model.actionInProgress = 'updating';
        $scope.onCancel();
      };
    }
  };
}]);
