'use strict';

/**
 */
angular.module('openolitor')
  .controller('ProjektSettingsController', ['$scope', '$filter',
    'ngTableParams',
    'KundentypenService',
    function($scope, $filter, ngTableParams, KundentypenService) {

      //watch for set of kundentypen
      $scope.$watch(KundentypenService.getKundentypen,
        function(list) {
          if (list) {
            $scope.kundentypen = [];
            angular.forEach(list, function(item) {
              if (item.id) {
                $scope.kundentypen.push(item);
              }
            });
            $scope.kundentypenTableParams.reload();
          }
        });


      $scope.addKundentyp = function() {
        $scope.kundentypen.push({
          id: undefined
        });
        $scope.kundentypenTableParams.reload();
      };

      if (!$scope.kundentypenTableParams) {
        //use default tableParams
        $scope.kundentypenTableParams = new ngTableParams({ // jshint ignore:line
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
            if (!$scope.kundentypen) {
              return;
            }
            // use build-in angular filter
            var orderedData = params.sorting ?
              $filter('orderBy')($scope.kundentypen, params.orderBy()) :
              $scope.kundentypen;

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }
    }
  ]);
