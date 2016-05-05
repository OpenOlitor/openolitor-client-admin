'use strict';

angular.module('openolitor').directive('ooSaveButton', ['msgBus', 'gettext',
  'alertService', 'DataUtil',
  function(msgBus, gettext, alertService, DataUtil) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        entity: '@',
        entities: '=?',
        model: '=',
        onSave: '=',
        onCancel: '=',
        form: '=',
        onCreated: '=',
        reduced: '@?',
        notext: '@?',
        small: '@?'
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-savebutton.directive.html',
      controller: function($scope) {

        if (!angular.isUndefined($scope.reduced) && $scope.reduced) {
          $scope.notext = true;
          $scope.small = true;
        }

        $scope.isNew = function() {
          return !$scope.model || $scope.model.id === undefined;
        };

        var entityMatches = function(entity) {
          if (angular.isArray($scope.entities)) {
            return $scope.entities.indexOf(entity) > -1;
          } else {
            return $scope.entity === entity;
          }
        };

        msgBus.onMsg('EntityModified', $scope, function(event, msg) {
          if (entityMatches(msg.entity) && !angular.isUndefined($scope.model) && msg.data.id === $scope.model
            .id) {
            if ($scope.model.actionInProgress !== 'updating') {
              alertService.addAlert('info', $scope.entity + gettext(
                ' wurde durch eine andere Person geändert. Bitte laden Sie die Ansicht neu.'
              ));
            } else {
              DataUtil.update(msg.data, $scope.model);
              $scope.model.actionInProgress = undefined;
              $scope.$apply();
            }
          }
        });

        msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
          if ($scope.model && entityMatches(msg.entity) && msg.data.id ===
            $scope.model.id) {
            DataUtil.update(msg.data, $scope.model);
            $scope.model.actionInProgress = undefined;
            if ($scope.onCreated) {
              $scope.onCreated(msg.data.id);
            }
            $scope.$apply();
          }
        });

        $scope.save = function() {
          $scope.model.actionInProgress = 'updating';
          var ret = $scope.onSave($scope.model);
          if(!angular.isUndefined(ret.catch)) {
            ret.catch(function(req) {
              $scope.model.actionInProgress = undefined;
              alertService.addAlert('error', gettext($scope.entity +
                  ' konnte nicht gespeichert werden. Fehler: ') +
                req.status +
                '-' + req.statusText + ':' + req.data
              );
            });
          } else {
            $scope.model.actionInProgress = undefined;
          }
        };


        $scope.cancel = function() {
          $scope.model.actionInProgress = 'updating';
          $scope.onCancel();
        };
      }
    };
  }
]);
