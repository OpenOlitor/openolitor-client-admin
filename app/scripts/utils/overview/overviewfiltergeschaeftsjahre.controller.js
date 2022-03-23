'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('OverviewfilterGeschaeftsjahreController', ['$scope', '$rootScope',
    'ProjektModel',
    function($scope, $rootScope, ProjektModel) {

      const ALLE = {jahr:'Alle'};

      ProjektModel.query({}, function(result) {
        ProjektModel.geschaeftsjahre({id: result.id}, function(gjL) {
            $scope.geschaeftsjahre = gjL;
            $scope.geschaeftsjahre.unshift(ALLE);
            if($scope.select) {
              $scope.geschaeftsjahre.forEach((item) => {
                if($scope.select == item.jahr) {
                  $scope.selectedGJ = $scope.select;
                }
              });
            } else {
              $scope.selectedGJ = ALLE.jahr;
            }
        });
      });

      $scope.displayGeschaeftsjahre = function(gj) {
        if(angular.isUndefined(gj.tag)) {
          return gj.jahr;
        } else {
          return gj.tag + '.' + gj.monat + '.' + gj.jahr;
        }
      };

      $scope.selectGJ = function(gj) {
        $scope.selectedGJ = gj;
        if(gj && gj.jahr != ALLE.jahr) {
          $scope.selectedFunct()(gj);
        } else {
          $scope.selectedFunct()();
        }
      };
    }
  ]);
