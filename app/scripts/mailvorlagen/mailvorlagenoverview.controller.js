'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('MailvorlagenOverviewController', ['$scope','MailvorlagenModel',
    function($scope, MailvorlagenModel) {
      $scope.vorlageTypen = [];
      MailvorlagenModel.query({}, function(result) {
        angular.forEach(result, function(vorlage) {
            if ($scope.vorlageTypen.indexOf(vorlage.templateType) === -1) {
                $scope.vorlageTypen.push(vorlage.templateType);
            } 
        });
      });
    }
  ]);
