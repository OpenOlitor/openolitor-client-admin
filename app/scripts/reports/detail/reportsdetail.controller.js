'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ReportsDetailController', ['$scope', '$filter', '$routeParams',
    '$location', '$uibModal', 'gettext', 'ReportsModel', '$log',
    function($scope, $filter, $routeParams, $location, $uibModal, gettext, ReportsModel, $log) {

      var defaults = {
        model: {
          id: undefined
        }
      };


      if (!$routeParams.id || $routeParams.id === 'new') {
        $scope.report = new ReportsModel(defaults.model);
      } else {
        ReportsModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.report = result;
        });
      }

      $scope.isExisting = function() {
        return angular.isDefined($scope.report) && angular.isDefined($scope.report.id);
      };

      $scope.save = function() {
        return $scope.report.$save();
      };

      $scope.created = function(id) {
        $location.path('/reports/' + id);
      };

      $scope.backToList = function() {
        $location.path('/reports');
      };

      $scope.delete = function() {
        return $scope.report.$delete();
      };

      $scope.executeReport = function(report) {
        $location.path('/reports/' + report.id + '/execute');
      };

    }
  ]);
