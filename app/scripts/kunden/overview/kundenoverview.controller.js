'use strict';

/**
 */
angular.module('openolitor')
  .controller('KundenOverviewController', ['$q', '$scope', '$filter',
    'KundenOverviewModel', 'NgTableParams', 'KundentypenService',
    function($q, $scope, $filter, KundenOverviewModel, NgTableParams,
      KundentypenService) {

      $scope.entries = [];
      $scope.loading = false;

      $scope.kundentypen = [];
      $scope.$watch(KundentypenService.getKundentypen,
        function(list) {
          if (list) {
            angular.forEach(list, function(item) {
              //check if system or custom kundentyp, use only id
              var id = (item.kundentyp) ? item.kundentyp :
                item;
              $scope.kundentypen.push({
                'id': id,
                'title': id
              });
            });
            $scope.tableParams.reload();
          }
      });

      $scope.search = {
        query: ''
      };

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
          filter: {
            typen: ''
          }
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
            var filteredData = $filter('filter')($scope.entries,
              $scope.search.query);
            var orderedData = $filter('filter')(filteredData, params.filter());
            orderedData = params.sorting ?
              $filter('orderBy')(orderedData, params.orderBy()) :
              orderedData;

            params.total(orderedData.length);
            return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = KundenOverviewModel.query({
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
