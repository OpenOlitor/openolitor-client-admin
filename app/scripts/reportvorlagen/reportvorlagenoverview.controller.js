'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ReportvorlagenOverviewController', ['$scope', 'ReportvorlageTypenModel',
    'ReportvorlagenModel', 'lodash',
    function($scope, ReportvorlageTypenModel, ReportvorlagenModel, lodash) {
      ReportvorlageTypenModel.query({}, function(result) {
        $scope.vorlageTypen = result;
      });

      ReportvorlagenModel.query({}, function(result) {
        $scope.vorlagen = lodash.groupBy(result, 'typ');
      });
    }
  ]);
