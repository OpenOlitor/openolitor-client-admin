'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbosOverviewController', ['$scope', '$filter','$location',
    'AbosOverviewModel', 'ngTableParams', 'AbotypenOverviewModel', 'FilterQueryUtil',
    function($scope, $filter, $location, AbosOverviewModel, ngTableParams, AbotypenOverviewModel, FilterQueryUtil) {

      $scope.entries = [];
      $scope.loading = false;
      $scope.selectedAbo = undefined;

      $scope.search = {
        query: '',
        queryQuery: '',
        filterQuery: ''
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
            id: 'asc'
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
              .search.queryQuery);
            var orderedData = $filter('filter')(filteredData, params.filter());
            orderedData = params.sorting ?
              $filter('orderBy')(orderedData, params.orderBy()) :
              orderedData;

            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.loading = true;
        $scope.entries = AbosOverviewModel.query({
          f: $scope.search.filterQuery
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
          $location.search('q', $scope.search.query);
        });
      }

      var existingQuery = $location.search()['q'];
      if(existingQuery) {
        $scope.search.query = existingQuery;
      }

      $scope.$watch('search.query', function() {
        $scope.search.filterQuery = FilterQueryUtil.transform($scope.search.query);
        $scope.search.queryQuery = FilterQueryUtil.withoutFilters($scope.search.query);
        search();
      }, true);

    }
  ]);
