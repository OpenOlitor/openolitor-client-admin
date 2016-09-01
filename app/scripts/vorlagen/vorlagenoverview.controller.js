'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('VorlagenOverviewController', ['$scope', 'VorlageTypenModel',
    'VorlagenModel', 'lodash',
    function($scope, VorlageTypenModel, VorlagenModel, lodash) {
      VorlageTypenModel.query({}, function(result) {
        $scope.vorlageTypen = result;
      });

      VorlagenModel.query({}, function(result) {
        $scope.vorlagen = lodash.groupBy(result, 'typ');
      });
    }
  ]);
