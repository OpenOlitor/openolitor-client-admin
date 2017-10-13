'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('JobqueueResultController', ['$scope', '$uibModalInstance',
    'JobqueueService',
    'msgBus',
    'lodash',
    'results',
    'FileUtil',
    function($scope, $uibModalInstance, JobqueueService, msgBus, lodash,
      results, FileUtil) {

      $scope.results = results;

      var removeResult = function(result) {
        lodash.remove($scope.results, function(r) {
          return (r.jobId.id === result.jobId.id);
        });
      };

      $scope.close = function() {
        $uibModalInstance.close();
      };

      $scope.downloadResult = function(result) {
        result.isDownloading = true;
        FileUtil.downloadGet('queue/job/' + result.jobId.id, result.jobId.name,
          'application/pdf',
          function() {
            result.isDownloading = false;
            removeResult(result);
          });
      };

      $scope.downloadAllAndClose = function() {
        lodash.forEach($scope.results, function(result) {
          $scope.downloadResult(result);
        });
        $scope.close();
      };

      msgBus.onMsg('PendingJobResults', $scope, function(event, msg) {
        $scope.results = msg.results;
        $scope.$apply();
      });

      msgBus.onMsg('JobFetched', $scope, function(event, msg) {
        removeResult(msg);

        // Close dialog if last result was fetched
        if ($scope.results.length === 0) {
          $scope.close();
        }
        $scope.$apply();
      });
    }
  ]);
