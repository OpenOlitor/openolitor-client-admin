'use strict';

angular.module('openolitor')
  .factory('OverviewCheckboxUtil', function() {
    var checkboxWatchCallback = function($scope, value) {
      angular.forEach($scope.entries, function(item) {
        $scope.checkboxes.items[item.id] = value;
      });
    };

    var dataCheckboxWatchCallback = function($scope) {
      var checked = 0,
        unchecked = 0,
        total = $scope.filteredEntries.length;
      $scope.checkboxes.ids = [];
      if (!$scope.checkboxes.data) {
        $scope.checkboxes.data = {};
      }
      angular.forEach($scope.filteredEntries, function(item) {
        checked += ($scope.checkboxes.items[item.id]) || 0;
        unchecked += (!$scope.checkboxes.items[item.id]) || 0;
        if ($scope.checkboxes.items[item.id]) {
          $scope.checkboxes.ids.push(item.id);
        }
        $scope.checkboxes.data[item.id] = item;
      });
      if ((unchecked === 0) || (checked === 0)) {
        $scope.checkboxes.checked = (checked === total) && checked > 0;
        $scope.checkboxes.checkedAny = (checked > 0);
      }
      // grayed checkbox
      else if ((checked !== 0 && unchecked !== 0)) {
        $scope.checkboxes.css = 'select-all:indeterminate';
        $scope.checkboxes.checkedAny = true;
      } else {
        $scope.checkboxes.css = 'select-all';
        $scope.checkboxes.checkedAny = true;
      }
    };

    return {
      checkboxWatchCallback: checkboxWatchCallback,
      dataCheckboxWatchCallback: dataCheckboxWatchCallback
    };
  });
