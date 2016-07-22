'use strict';

/**
 * OO Actions Button Directive
 * @namespace Directives
 *
 * @description
 * This directive adds a split button dropdown for the given array of actions.
 *
 * @scope
 *
 * @param {string} entity The entity that will be used to match messages.
 * @param {Array.<Object>=} entities Multiple entities that will be used to match messages.
 * @param {Object} model The related angular resource.
 * @param {Array.<Object>} actions An array of actions of the form:
 *                         {
 *                           iconClass: string, // if left undefined, a save icon will be used
 *                           label: string, // either label or labelFunction has to be defined
 *                           labelFunction: function, // optional
 *                           noText: boolean, // optional
 *                           noEntityText: boolean, // optional
 *                           onExecute: function(model), // will be executed on click
 *                           isDisabled: function(model),
 *                           isHidden: function(model) // hide this action
 *                         }
 */
angular.module('openolitor').directive('ooActionsButton', ['msgBus', 'gettext',
  'alertService', 'DataUtil',
  function(msgBus, gettext, alertService, DataUtil) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        entity: '@',
        entities: '=?',
        model: '=',
        actions: '=',
        form: '=',
        reduced: '@?',
        small: '@?',
        onCreated: '='
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-actionsbutton.directive.html',
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
          if (entityMatches(msg.entity) && !angular.isUndefined(
              $scope.model) && msg.data.id === $scope.model
            .id) {
            if ($scope.model.actionInProgress !== 'updating') {
              if ($scope.entity) {
                alertService.addAlert('info', $scope.entity + gettext(
                  ' wurde durch eine andere Person geändert. Bitte laden Sie die Ansicht neu.'
                ));
              }
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

        $scope.executeAction = function(action) {
          $scope.model.actionInProgress = 'updating';
          var result = action.onExecute($scope.model);
          if (result && result.catch) {
            result.catch(function(req) {
              $scope.model.actionInProgress = undefined;
              if ($scope.entity) {
                alertService.addAlert('error', gettext(
                    'Aktion ' + action.label + ' für ' + $scope.entity +
                    ' konnte nicht ausgeführt werden. Fehler: ') +
                  req.status +
                  '-' + req.statusText + ':' + req.data
                );
              } else {
                alertService.addAlert('error', gettext(
                    'Aktion ' + action.label +
                    ' konnte nicht ausgeführt werden. Fehler: ') +
                  req.status +
                  '-' + req.statusText + ':' + req.data
                );
              }
            });
          } else {
            $scope.model.actionInProgress = undefined;
          }
        };
      }
    };
  }
]);
