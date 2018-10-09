'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ZahlungsExportsOverviewController', ['$q', '$scope', '$filter', '$location',
    'ZahlungsExportsOverviewModel', 'NgTableParams', 'localeSensitiveComparator','FileSaver', 'ZAHLUNGSEXPORTSTATUS', 'lodash',
    function($q, $scope, $filter, $location, ZahlungsExportsOverviewModel, NgTableParams,
      localeSensitiveComparator, FileSaver, ZAHLUNGSEXPORTSTATUS, lodash) {

      $scope.entries = [];
      $scope.loading = false;

      $scope.search = {
        query: ''
      };

      $scope.zahlungsExportStatus = ZAHLUNGSEXPORTSTATUS;
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
            var dataSet = $filter('filter')($scope.entries, $scope.search.query);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), true, localeSensitiveComparator) :
              dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });
      }

      $scope.createRechnungenLink = function(rechnungen){
          $location.path('/rechnungen').search('q', 'id=' + rechnungen).search('tf','{"status":""}')
      };

      $scope.download = function(id){
            ZahlungsExportsOverviewModel.fetchFile({
                id:id 
            }, function(file) {
                FileSaver.saveAs(file.response, 'pain_008_001_07.xml');
            });
      };

      $scope.saveStatusFunc = function(zahlungExportId){
          return function (status) {
            var index = lodash.findIndex($scope.entries,['id',zahlungExportId]); 
            $scope.entries[index].status = status;
            $scope.entries[index].$save();
        };
      }
        
      function search() {
        if ($scope.loading) {
          return;
        }
        //  $scope.entries = $scope.dummyEntries;
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = ZahlungsExportsOverviewModel.query({
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
