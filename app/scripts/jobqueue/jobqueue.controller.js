'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('JobqueueController', ['$scope', '$uibModal', 'JobqueueService',
    'ooAuthService',
    'msgBus',
    'lodash',
    function($scope, $uibModal, JobqueueService, ooAuthService, msgBus,
      lodash) {

      $scope.total = 0;
      $scope.success = 0;
      $scope.failures = 0;
      $scope.results = [];

      var setPendingJobs = function(pendingJobs) {
        $scope.pendingJobs = pendingJobs;
        $scope.total = 0;
        $scope.success = 0;
        $scope.failures = 0;

        lodash.forEach(pendingJobs, function(job) {
          $scope.total += job.numberOfSuccess + job.numberOfFailures +
            job.numberOfTasksInProgress;
          $scope.success += job.numberOfSuccess;
          $scope.failures += job.numberOfFailures;
        });
      };

      $scope.done = function() {
        return $scope.failures + $scope.success;
      };

      var load = function() {
        JobqueueService.loadPendingJobs().then(function(result) {
          if (result) {
            setPendingJobs(result.progresses);
          }
        });
        JobqueueService.loadPendingJobResults().then(function(data) {
          if (data) {
            $scope.results = data.results;
          }
        });
      };

      var unwatchLoggedIn = $scope.$watch(function() {
        return ooAuthService.getUser();
      }, function(user) {
        $scope.loggedIn = ooAuthService.isUserLoggedIn(user);

        if ($scope.loggedIn) {
          load();
        }
      });

      $scope.$on('destroy', function() {
        unwatchLoggedIn();
      });

      var modalInstance;
      $scope.showResultDialog = function() {
        if (!modalInstance) {
          modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'scripts/jobqueue/result/result.html',
            controller: 'JobqueueResultController',
            resolve: {
              results: function() {
                return $scope.results;
              }
            }
          });

          modalInstance.result.then(function() {
            modalInstance = undefined;
          }, function() {
            modalInstance = undefined;
          });
        }
      };

      msgBus.onMsg('PendingJobs', $scope, function(event, msg) {
        setPendingJobs(msg.progresses);
        $scope.$apply();
      });

      msgBus.onMsg('PendingJobResults', $scope, function(event, msg) {
        $scope.results = msg.results;
        $scope.showResultDialog();
        $scope.$apply();
      });

      msgBus.onMsg('JobFetched', $scope, function(event, msg) {
        lodash.remove($scope.results, function(r) {
          return (r.jobId.id === msg.jobId.id);
        });
        $scope.$apply();
      });
    }
  ]);
