'use strict';

angular.module('openolitor').directive('ooDeleteButton', ['$location', 'msgBus', 'gettext', 'alertService', function($location, msgBus, gettext, alertService) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '@',
      model: '=',
      onDelete: '=',
      form: '=',
      redirectOnDelete: '@'
    },
    transclude: true,
    templateUrl: 'scripts/common/components/oo-deletebutton.directive.html',
    controller: function($scope) {

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (msg.entity === $scope.entity && msg.data.id === $scope.model.id) {
          if ($scope.model.actionInProgress !== 'deleting') {
            alertService.addAlert('info', gettext($scope.entity + ' wurde durch eine andere Person gelöscht.'));
          } else {
            $scope.model.actionInProgress = undefined;
            alertService.addAlert('info', gettext($scope.entity + ' wurde erfolgreich gelöscht.'));
            $scope.$apply();
          }
          //redirect to main page
          $location.path($scope.redirectOnDelete);
        }
      });

      $scope.delete = function() {
        $scope.model.actionInProgress = 'deleting';
        $scope.onDelete();
      };
    }
  };
}]);
