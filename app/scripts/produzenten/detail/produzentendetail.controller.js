'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ProduzentenDetailController', ['$scope', '$rootScope', '$filter', '$routeParams',
    '$location', '$uibModal', 'gettext', 'ProduzentDetailModel', '$log', 
      'ProduzentenModel','lodash','alertService',
    function($scope, $rootScope, $filter, $routeParams, $location, $uibModal, gettext,
      ProduzentDetailModel, $log, ProduzentenModel, lodash, alertService) {
      $rootScope.viewId = 'D-Pzt';

      var defaults = {
        model: {
          id: undefined,
          aktiv: true,
          mwst: false
        }
      };

      var isNew = false;
      var originalNickname = null; 
      $scope.produzenten = ProduzentenModel.query({},function(){ });

      if (!$routeParams.id) {
        $scope.produzent = new ProduzentDetailModel(defaults.model);
        isNew = true;
      } else {
        ProduzentDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.produzent = result;
          $scope.produzentForm.$setPristine();
          isNew = false;
          originalNickname = $scope.produzent.kurzzeichen;
        });
      }

      $scope.produzentBezeichnung = function() {
        if (angular.isDefined($scope.produzent) && angular.isDefined($scope.produzent.name)) {
          var ret = $scope.produzent.name;
          if (angular.isDefined($scope.produzent.vorname)) {
            ret = ret  + ' ' + $scope.produzent.vorname;
          }
          return ret;
        }
        return undefined;
      };

      $scope.isExisting = function() {
        return angular.isDefined($scope.produzent) && angular.isDefined($scope.produzent.id);
      };

      $scope.save = function() {
        var listOfNicknames = lodash.map($scope.produzenten, 'kurzzeichen');
        var listOfNicknamesWithoutAccents = listOfNicknames.map(nickname => $scope.removeAccents(nickname));

        //new producer
        if (isNew && lodash.filter(listOfNicknamesWithoutAccents,function(n){ return n === $scope.removeAccents($scope.produzent.kurzzeichen)}).length > 0){
            alertService.addAlert('error', gettext('Dieser Produzent existiert bereits'));
            return "";
        //existing producer
        } else if (!isNew && originalNickname !== $scope.produzent.kurzzeichen && lodash.filter(listOfNicknamesWithoutAccents, function(n){ return n === $scope.removeAccents($scope.produzent)}).length > 0) { 
            alertService.addAlert('error', gettext('Dieser Produzent existiert bereits'));
            return "";
        } else {
            return $scope.produzent.$save(function() {
              $scope.produzentForm.$setPristine();
            });
        };
      };

      //normalization in order to remove the accents. https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
      $scope.removeAccents = function(string) {
        return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      }

      $scope.created = function(id) {
        $location.path('/produzenten/' + id);
      };

      $scope.backToList = function() {
        $location.path('/produzenten');
      };

      $scope.delete = function() {
        return $scope.produzent.$delete();
      };
    }
  ]);
