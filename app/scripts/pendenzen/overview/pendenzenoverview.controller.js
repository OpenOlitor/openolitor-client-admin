'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('PendenzenOverviewController', ['$q', '$scope', '$rootScope', '$filter',
    'PendenzenOverviewModel', 'NgTableParams', 'PENDENZSTATUS', 'localeSensitiveComparator', 'gettextCatalog', 'DetailNavigationService', 'lodash',
    function($q, $scope, $rootScope, $filter, PendenzenOverviewModel, NgTableParams, PENDENZSTATUS, localeSensitiveComparator, gettextCatalog, DetailNavigationService, lodash) {
      $rootScope.viewId = 'L-Pen';

      DetailNavigationService.cleanKundeList();
      $scope.entries = [];
      $scope.loading = false;

      $scope.search = {
        query: ''
      };

      $scope.statusL = [];
      angular.forEach(lodash.sortBy(PENDENZSTATUS, function(ps){
          return gettextCatalog.getString(ps).toLowerCase();
      }), function(value, key) {
        $scope.statusL.push({
          'id': value,
          'title': gettextCatalog.getString(value)
        });
      });

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            name: 'asc'
          },
          filter: { status: 'Ausstehend' }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var dataSet = $filter('filter')($scope.entries, $scope.search.query);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter(true));
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), false, localeSensitiveComparator) : dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = PendenzenOverviewModel.query({
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

      $scope.isUnresolved = function(pendenz) {
        return !angular.isUndefined(pendenz.status) && pendenz.status === PENDENZSTATUS.AUSSTEHEND;
      };

      $scope.markErledigt = function(pendenz) {
        pendenz.status = PENDENZSTATUS.ERLEDIGT;
        new PendenzenOverviewModel(pendenz).$save();
      };

    }
  ]);
