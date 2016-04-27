'use strict';

/**
 */
angular.module('openolitor')
  .controller('LieferplanungOverviewController', ['$q', '$scope', '$filter',
    'LieferplanungModel', 'ngTableParams', 'msgBus', '$location',
    function($q, $scope, $filter, LieferplanungModel, ngTableParams, msgBus, $location) {

      $scope.entries = [];
      $scope.loading = false;

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
            var orderedData = params.sorting ?
              $filter('orderBy')($scope.entries, params.orderBy()) :
              $scope.entries;
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
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = LieferplanungModel.query({ }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });

      }

      search();

      $scope.createNewLieferplanung = function() {
        $scope.newLieferplanung = new LieferplanungModel({bemerkungen: '', status: 'Offen'});
        return $scope.newLieferplanung.$save();
      };

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (msg.entity === 'Lieferplanung') {
          $location.url('/lieferplanung/' + msg.data.id);
          $scope.$apply();
        }
      });

    }
  ]);
