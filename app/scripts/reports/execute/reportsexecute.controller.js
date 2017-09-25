'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ReportsExecuteController', ['$scope', '$filter', '$routeParams',
    '$location', '$uibModal', 'gettext', 'ReportsModel', '$log',
    function($scope, $filter, $routeParams, $location, $uibModal, gettext,
      ReportsModel, $log) {


      ReportsModel.get({
        id: $routeParams.id
      }, function(result) {
        $scope.report = result;
      });


      $scope.executeReport = function() {
        ReportsModel.executeReport({id: $scope.report.id, query: $scope.report.query}, function(data) {
          alert('DDD' + data);
        });
      };

      $scope.editReport = function(report) {
        $location.path('/reports/' + report.id);
      };


    }
  ]);
