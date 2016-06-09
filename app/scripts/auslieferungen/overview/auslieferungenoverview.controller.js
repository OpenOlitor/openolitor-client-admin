'use strict';

/**
 */
angular.module('openolitor')
  .controller('AuslieferungenOverviewController', ['$q', '$scope', '$filter', '$route',
    'DepotAuslieferungenModel', 'TourAuslieferungenModel', 'PostAuslieferungenModel', 'ngTableParams', 'AUSLIEFERUNGSTATUS',
    function($q, $scope, $filter, $route, DepotAuslieferungenModel, TourAuslieferungenModel, PostAuslieferungenModel, ngTableParams, AUSLIEFERUNGSTATUS) {

      $scope.entries = [];
      $scope.loading = false;

      $scope.search = {
        query: ''
      };

      var model = $route.current.$$route.model;
      var overviewModel;

      switch (model) {
        case 'Depot':
          overviewModel = DepotAuslieferungenModel;
          break;
        case 'Tour':
          overviewModel = TourAuslieferungenModel;
          break;
        case 'Post':
          overviewModel = PostAuslieferungenModel;
          break;
      }

      $scope.statusL = [];
      angular.forEach(AUSLIEFERUNGSTATUS, function(value, key) {
        $scope.statusL.push({
          'id': key,
          'title': value
        });
      });

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
          },
          filter: {
            status: AUSLIEFERUNGSTATUS.ERFASST
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
            var filteredData = $filter('filter')($scope.entries,
              $scope
              .search.query);
            var orderedData = $filter('filter')(filteredData, params.filter());
            orderedData = params.sorting ?
              $filter('orderBy')(orderedData, params.orderBy()) : orderedData;

            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        //  $scope.entries = $scope.dummyEntries;
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = overviewModel.query({
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
