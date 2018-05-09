'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('MailvorlagenOverviewController', ['$scope', 'MailvorlageTypenModel',
    'MailvorlagenModel', 'lodash',
    function($scope, MailvorlageTypenModel, MailvorlagenModel, lodash) {
      MailvorlageTypenModel.query({}, function(result) {
        $scope.vorlageTypen = result;
      });
    }
  ]);
