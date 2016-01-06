'use strict';

angular.module('openolitor').directive('ooDeleteButton', ['msgBus', 'gettext', 'alertService', function(msgBus, gettext, alertService) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '@',
      entities: '=?',
      model: '=',
      onDelete: '=',
      form: '=',
      onDeleted: '='
    },
    transclude: true,
    templateUrl: 'scripts/common/components/oo-deletebutton.directive.html',
    controller: function($scope) {

      var entityMatches = function(entity) {
        if (angular.isArray($scope.entities)) {
          return $scope.entities.indexOf(entity) > -1;
        } else {
          return $scope.entity === entity;
        }
      };
      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (entityMatches(msg.entity) && msg.data.id === $scope.model.id) {
          if ($scope.model.actionInProgress !== 'deleting') {
            alertService.addAlert('info', gettext($scope.entity + ' wurde durch eine andere Person gelöscht.'));
          } else {
            $scope.model.actionInProgress = undefined;
            alertService.addAlert('info', gettext($scope.entity + ' wurde erfolgreich gelöscht.'));
            $scope.$apply();
          }
          //redirect to main page
          $scope.onDeleted(msg.data.id);
        }
      });

      $scope.delete = function() {
        $scope.model.actionInProgress = 'deleting';
        $scope.onDelete();
      };
    }
  };
}]);
