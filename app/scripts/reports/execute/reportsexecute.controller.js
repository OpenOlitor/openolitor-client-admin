'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ReportsExecuteController', ['$scope', '$filter', '$routeParams',
    '$location', '$uibModal', 'gettext', 'ReportsModel', 'NgTableParams', 'localeSensitiveComparator', '$log',
    function($scope, $filter, $routeParams, $location, $uibModal, gettext,
      ReportsModel, NgTableParams, localeSensitiveComparator, $log) {

      $scope.search = {
        query: ''
      };

      ReportsModel.get({
        id: $routeParams.id
      }, function(result) {
        $scope.report = result;
      });

      $scope.renderedInput = function($scope, row) {
        return row[this.field];
      };

      $scope.cols = [];

      $scope.executeReport = function() {
        $scope.resulat = {};
        ReportsModel.executeReport({id: $scope.report.id, query: $scope.report.query}, function(data) {
          if(data && data[0]) {
            $scope.cols = [];
            for(var key in data[0]) {
              if(key.indexOf('$') !== 0 && key !== 'toJSON') {
                $scope.cols.push({
                  field: key,
                  title: key,
                  getValue: $scope.renderedInput,
                });
              }
            }
          }
          $scope.resulat.entries = data;
          $scope.tableParams.reload();
        });
      };

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: ReportsModel,
          exportODSFilter: function() {
            return {
              id: $scope.report.id,
              query: $scope.report.query
            };
          },
          getData: function(params) {
            if (!$scope.resulat || !$scope.resulat.entries) {
              return;
            }
            // use build-in angular filter
            var dataSet = $filter('filter')($scope.resulat.entries, $scope.search.query);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), true, localeSensitiveComparator) : dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });
      }

      $scope.editReport = function(report) {
        $location.path('/reports/' + report.id);
      };

      $scope.changeReport = function() {
        $scope.resulat = undefined;
      };

    }
  ]);
