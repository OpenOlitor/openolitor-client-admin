'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbosOverviewController', ['$scope', '$filter',
    'AbosOverviewModel', 'ngTableParams', 'AbotypenOverviewModel',
    function($scope, $filter, AbosOverviewModel, ngTableParams, AbotypenOverviewModel) {

      $scope.entries = [];
      $scope.loading = false;
      $scope.selectedAbo = undefined;

      $scope.search = {
        query: ''
      };
      $scope.checkboxes = {
        checked: false,
        items: {},
        css: ''
      };

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      $scope.abotypL = [];
      AbotypenOverviewModel.query({
        q: ''
      }, function(list) {
        angular.forEach(list, function(abotyp) {
          $scope.abotypL.push({
            'id': abotyp.id,
            'title': abotyp.name
          });
        });
      });

      // watch for check all checkbox
      $scope.$watch(function() {
        return $scope.checkboxes.checked;
      }, function(value) {
        angular.forEach($scope.entries, function(item) {
          $scope.checkboxes.items[item.id] = value;
        });
      });

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function() {
        var checked = 0, unchecked = 0,
            total = $scope.entries.length;
        angular.forEach($scope.entries, function(item) {
          checked   +=  ($scope.checkboxes.items[item.id]) || 0;
          unchecked += (!$scope.checkboxes.items[item.id]) || 0;
        });
        if ((unchecked === 0) || (checked === 0)) {
          $scope.checkboxes.checked = (checked === total);
        }
        // grayed checkbox
        if ((checked !== 0 && unchecked !== 0)) {
          $scope.checkboxes.css = 'select-all:indeterminate';
        }
        else {
          $scope.checkboxes.css = 'select-all';
        }
      }, true);

      $scope.toggleShowAll = function() {
        $scope.showAll = !$scope.showAll;
        $scope.tableParams.reload();
      };

      $scope.selectAbo = function(abo) {
        if ($scope.selectedAbo === abo) {
          $scope.selectedAbo = undefined;
        }
        else {
          $scope.selectedAbo = abo;
        }
      };

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new ngTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            kunde: 'asc'
          },
          filter: { abotypId: '' }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function($defer, params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries, $scope
              .search.query);
            var orderedData = params.sorting ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              filteredData;
            orderedData = $filter('filter')($scope.entries, params.filter());

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }

        $scope.loading = true;
        $scope.entries = AbosOverviewModel.query({
          q: $scope.query
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      search();

      $scope.$watch('search.query', function() {
        search();
      }, true);

    }
  ]);
