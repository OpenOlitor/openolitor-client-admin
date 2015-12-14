'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbosOverviewController', ['$scope', '$filter', 'AbosOverviewModel', 'ngTableParams', function($scope, $filter, AbosOverviewModel, ngTableParams) {

    $scope.entries = [];
    $scope.loading = false;

    $scope.dummyEntries = [{
      id: 'c8926129-045d-4f78-9c79-0ee873aed781',
      personId: 'c8926129-045d-4f78-9c79-0ee873aed787',
      personName: 'Calvert',
      personVorname: 'Joshua',
      abotypId: 'c8926129-045d-4f78-9c79-0ee873aed785',
      abotypName: 'Vegi klein',
      depotId: '614275dc-29f5-4aa9-86eb-36ee873778b8',
      depotName: 'Tingel-Kringel'
    }, {
      id: 'c8926129-045d-4f78-9c79-0ee873aed785',
      personId: 'c8926129-045d-4f78-9c79-0ee873aed783',
      personName: 'Saldana',
      personVorname: 'Ione',
      abotypId: 'c8926129-045d-4f78-9c79-0ee873aed789',
      abotypName: 'Vegi gross',
      depotId: '614275dc-29f5-4aa9-86eb-36ee873778c8',
      depotName: 'Punto'
    }];

    $scope.search = {
      query: ''
    };

    $scope.hasData = function() {
      return $scope.entries !== undefined;
    };

    if (!$scope.tableParams) {
      //use default tableParams
      $scope.tableParams = new ngTableParams({ // jshint ignore:line
        page: 1,
        count: 10,
        sorting: {
          name: 'asc'
        }
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
          var filteredData = $filter('filter')($scope.entries, $scope.search.query);
          var orderedData = params.sorting ?
            $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

          params.total(orderedData.length);
          $defer.resolve(orderedData);
        }

      });
    }

    function search() {
      if ($scope.loading) {
        return;
      }
      $scope.tableParams.reload();

      $scope.loading = true;
      $scope.entries = AbosOverviewModel.query({
        q: $scope.query
      }, function() {
        $scope.tableParams.reload();
        $scope.loading = false;
      });

      $scope.entries = $scope.dummyEntries;
      $scope.tableParams.reload();
      $scope.loading = false;
    }

    search();

    $scope.$watch('search.query', function() {
      search();
    }, true);

  }]);
