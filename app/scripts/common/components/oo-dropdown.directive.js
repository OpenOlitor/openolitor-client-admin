'use strict';

angular.module('openolitor').directive('ooDropdown', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      placeholder: '@',
      values: '=',
      selected: '=',
      selectedProp: '@',
      selectedFunction: '&?',
      selectedFunctionScope: '=',
      property: '@',
      displayFunction: '=',
      dropdownId: '@',
      displayStyle: '@',
      label: '=',
      disabled: '=',
      selectionRequired: '='
    },
    templateUrl: 'scripts/common/components/oo-dropdown.directive.html',
    compile: function(element, attrs) {
      if (!attrs.displayStyle) {
        attrs.displayStyle = 'navbar';
      }
    },
    controller: function($scope) {

      $scope.listVisible = false;
      $scope.display = '';
      $scope.isPlaceholder = true;
      $scope.selectedItem = undefined;

      var deepFind = function(obj, path) {
        var paths = path.split('.'),
          current = obj,
          i;

        for (i = 0; i < paths.length; ++i) {
          if (current[paths[i]] === undefined) {
            return undefined;
          } else {
            current = current[paths[i]];
          }
        }
        return current;
      };

      $scope.select = function(item) {
        $scope.isPlaceholder = false;
        if (angular.isDefined($scope.selectedProp)) {
          $scope.selected = deepFind(item, $scope.selectedProp);
        } else {
          $scope.selected = item;
        }
        $scope.selectedItem = item;
        if (angular.isDefined($scope.selectedFunction)) {
          if ($scope.selectedFunction()($scope.selectedItem, $scope.selectedFunctionScope)) {
            //if functions returns 'true', selection is reset
            $scope.selectedItem = undefined;
            $scope.selected = undefined;
          }
        }
        $scope.updateDisplay();
      };

      $scope.getDisplayedText = function(item) {
        if (!angular.isUndefined($scope.property)) {
          return deepFind(item, $scope.property);
        } else if (!angular.isUndefined($scope.displayFunction)) {
          return $scope.displayFunction(item);
        } else {
          return item;
        }
      };

      $scope.getClass = function() {
        if ($scope.selectionRequired && angular.isUndefined($scope.selected)) {
          return 'oo-invalid';
        } else {
          return '';
        }
      };

      $scope.updateDisplay = function() {
        $scope.isPlaceholder = angular.isUndefined($scope.selected);
        if (!angular.isUndefined($scope.displayFunction) && !angular.isUndefined(
            $scope.selectedItem)) {
          $scope.display = $scope.displayFunction($scope.selectedItem);
        } else if ($scope.property) {
          if (!angular.isUndefined($scope.selected) && angular.isUndefined(
              $scope.selectedItem)) {
            //initial state, get selected item to display
            angular.forEach($scope.values, function(value) {
              if (!angular.isUndefined($scope.selectedProp)) {
                if (deepFind(value, $scope.selectedProp) === $scope
                  .selected) {
                  $scope.display = deepFind(value, $scope.property);
                }
              } else {
                if (value === $scope.selected) {
                  $scope.display = value;
                }
              }
            });
          } else if (!angular.isUndefined($scope.selectedItem)) {
            $scope.display = deepFind($scope.selectedItem, $scope.property);
          }
        } else {
          if (!angular.isUndefined($scope.selected) && angular.isUndefined(
              $scope.selectedItem)) {
            $scope.display = $scope.selected;
          } else {
            $scope.display = $scope.selectedItem;
          }
        }
      };
      $scope.updateDisplay();

      $scope.unwatchSelected = $scope.$watch('selected', function() {
        if (!angular.isUndefined($scope.selected)) {
          $scope.updateDisplay();
          $scope.unwatchSelected();
        }
      }, true);

    }
  };
});
