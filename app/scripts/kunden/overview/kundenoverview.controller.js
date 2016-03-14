'use strict';

/**
 */
angular.module('openolitor')
  .controller('KundenOverviewController', ['$q', '$scope', '$filter',
    'KundenOverviewModel', 'ngTableParams', 'KundentypenService',
    function($q, $scope, $filter, KundenOverviewModel, ngTableParams,
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

      $scope.dummyEntries = [{
        id: '614275dc-29f5-4aa9-86eb-36ee873778b8',
        bezeichnung: 'Calvert Joshua',
        strasse: 'Jupiterstrasse',
        hausNummer: 40,
        plz: 3020,
        ort: 'Bern',
        typen: ['Goenner', 'Vereinsmitglied']
      }, {
        id: '88827d1d-293c-405a-b0fb-aa392efe6d50',
        bezeichnung: 'WG Bern',
        strasse: 'Jupiterstrasse',
        hausNummer: 23,
        plz: 3015,
        ort: 'Bern',
        typen: ['Vereinsmitglied']
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
          },
          filter: { typen: '' }
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
              $scope.search.query);
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
        //  $scope.entries = $scope.dummyEntries;
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = KundenOverviewModel.query({
          q: $scope.query
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });

        //$scope.entries = $scope.dummyEntries;

      }

      search();

      $scope.$watch('search.query', function() {
        search();
      }, true);

    }
  ]);
