'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('OverviewfilterGeschaeftsjahreController', ['$scope', '$rootScope',
    'ProjektModel', 'moment', '$cookies',
    function($scope, $rootScope, ProjektModel, moment, $cookies) {

      const ALLE = {jahr:'Alle'};

      var storeSelected = function(selected) {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 3650);
        $cookies.put('gjFilterSelected', selected, {'expires' : expireDate});
      };

      var fetchSelected = function() {
        return $cookies.get('gjFilterSelected');
      };

      ProjektModel.query({}, function(result) {
        $scope.projekt = result;
        ProjektModel.geschaeftsjahre({id: result.id}, function(gjL) {
            $scope.geschaeftsjahre = gjL;
            $scope.geschaeftsjahre.unshift(ALLE);
            if(angular.isUndefined($scope.select)) {
              //if no preselected value, check if
              if(angular.isDefined($scope.selectCurrent) && !angular.isDefined(fetchSelected())) {
                var thisYearsGJstart = moment().date($scope.projekt.geschaeftsjahrTag).month($scope.projekt.geschaeftsjahrMonat - 1);
                if(moment().isBefore(thisYearsGJstart)) {
                  $scope.select = moment().year() - 1;
                } else {
                  $scope.select = moment().year();
                }
              } else if(angular.isDefined($scope.selectCurrent)) {
                var stored = fetchSelected();
                if(angular.isDefined(stored)) {
                  $scope.select = stored;
                }
              }
            }

            if(angular.isDefined($scope.select)) {
              $scope.geschaeftsjahre.forEach((item) => {
                if($scope.select == item.jahr) {
                  $scope.selectGJ($scope.select, true);
                }
              });
            } else {
                //by default 'ALLE' is selected
                $scope.selectGJ(ALLE.jahr, true);
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

      $scope.selectGJ = function(gj, init = false) {
        $scope.selectedGJ = gj;
        if(gj && gj != ALLE.jahr && (angular.isUndefined(gj.jahr) || gj.jahr != ALLE.jahr)) {
          $scope.selectedFunct()((gj.jahr) ? gj.jahr : gj);
        } else {
          $scope.selectedFunct()();
        }
        if(angular.isDefined($scope.selectCurrent) || !init) {
          storeSelected(angular.isDefined($scope.selectedGJ.jahr) ? $scope.selectedGJ.jahr : $scope.selectedGJ);
        }
      };
    }
  ]);
