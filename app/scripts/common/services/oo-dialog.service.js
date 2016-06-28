  'use strict';

  angular.module('openolitor').factory('dialogService', ['$uibModal', function($uibModal) {

    return {
      displayDialogOkAbort: function(msg, okFct) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/common/components/oo-dialogokabort.directive.modal.html',
          controller: 'ooDialogOkAbortModalInstanceCtrl',
          resolve: {
            message: function() {
              return msg;
            }
          }
        });

        modalInstance.result.then(okFct);
      }

    };
  }]);
