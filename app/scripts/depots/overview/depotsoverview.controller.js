'use strict';

/**
 */
angular.module('openolitor')
  .controller('DepotsOverviewController', ['$scope', '$filter', 'DepotsOverviewModel', 'ngTableParams', function($scope, $filter, DepotsOverviewModel, ngTableParams) {

    $scope.entries = [];
    $scope.loading = false;

    $scope.dummyEntries = [{
      id: '614275dc-29f5-4aa9-86eb-36ee873778b8',
      name: 'Tingel-Kringel',
      apName: 'Tree',
      apVorname: 'Joshua',
      apTelefon: '079 666 99 99',
      vName: 'Baumann',
      vVorname: 'Julie',
      vTelefon: '079 666 99 98',
      anzahlAbonnenten: 1,
      anzahlAbonnentenMax: 10
    }, {
      id: '614275dc-29f5-4aa9-86eb-36ee873778c8',
      name: 'Punto',
      apName: 'Bochovski',
      apVorname: 'Josh',
      apTelefon: '079 666 99 89',
      vName: 'Red',
      vVorname: 'Till',
      vTelefon: '079 666 99 78',
      anzahlAbonnenten: 8,
      anzahlAbonnentenMax: 88
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
          orderedData = $filter('filter')(filteredData, params.filter());

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
      $scope.entries = DepotsOverviewModel.query({
        q: $scope.query
      }, function() {
        $scope.tableParams.reload();
        $scope.loading = false;
      });

      //TODO Remove if conntected
      $scope.entries = $scope.dummyEntries;
      $scope.tableParams.reload();
      $scope.loading = false;

    }

    search();

    $scope.$watch('search.query', function() {
      search();
    }, true);

  }]);
