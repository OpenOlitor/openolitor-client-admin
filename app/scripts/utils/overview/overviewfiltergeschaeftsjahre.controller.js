'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('OverviewfilterGeschaeftsjahreController', ['$scope', '$rootScope',
    'ProjektModel', 'moment',
    function($scope, $rootScope, ProjektModel, moment) {

      const ALLE = {jahr:'Alle'};

      ProjektModel.query({}, function(result) {
        $scope.projekt = result;
        ProjektModel.geschaeftsjahre({id: result.id}, function(gjL) {
            $scope.geschaeftsjahre = gjL;
            $scope.geschaeftsjahre.unshift(ALLE);
            if(angular.isUndefined($scope.select)) {
              //if no preselected value, check if
              if(angular.isDefined($scope.selectCurrent)) {
                var thisYearsGJstart = moment().date($scope.projekt.geschaeftsjahrTag).month($scope.projekt.geschaeftsjahrMonat - 1);
                if(moment().isBefore(thisYearsGJstart)) {
                  $scope.select = moment().year() - 1;
                } else {
                  $scope.select = moment().year();
                }
              }
            }

            if(angular.isDefined($scope.select)) {
              $scope.geschaeftsjahre.forEach((item) => {
                if($scope.select == item.jahr) {
                  $scope.selectedGJ = $scope.select;
                }
              });
            } else {
                //by default 'ALLE' is selected
                $scope.selectedGJ = ALLE.jahr;
            }
        });
      });

      $scope.displayGeschaeftsjahre = function(gj) {
        var von = moment(gj.jahr + '-' + gj.monat + '-' + gj.tag);
        var bis = moment(von);
        bis.add(1, 'year');
        bis.add(-1, 'day');
        if(angular.isUndefined(gj.tag)) {
          return gj.jahr;
        } else {
          return von.format('L') + ' - ' + bis.format('L');
        }
      };

      $scope.selectGJ = function(gj) {
        $scope.selectedGJ = gj;
        if(gj && gj != ALLE.jahr && (angular.isUndefined(gj.jahr) || gj.jahr != ALLE.jahr)) {
          $scope.selectedFunct()((gj.jahr) ? gj.jahr : gj);
        } else {
          $scope.selectedFunct()();
        }
      };
    }
  ]);
