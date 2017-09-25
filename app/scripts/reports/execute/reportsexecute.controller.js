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


      $scope.execute = function() {
        return 'TODO';
      };


    }
  ]);
