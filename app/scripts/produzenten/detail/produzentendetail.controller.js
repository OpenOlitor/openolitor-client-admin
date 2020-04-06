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
        return angular.isDefined($scope.produzent) && angular.isDefined($scope.produzent
          .id);
      };

      $scope.save = function() {
        var listOfNicknames = lodash.map($scope.produzenten, 'kurzzeichen');
        //new producer
        if (isNew && lodash.filter(listOfNicknames, function(n){ return n === $scope.produzent.kurzzeichen}).length > 0){
            alertService.addAlert('error', gettext('Diese produzent existiert bereits'));
            return "";
        //existing producer
        } else if (!isNew && originalNickname !== $scope.produzent.kurzzeichen && lodash.filter(listOfNicknames, function(n){ return n === $scope.produzent.kurzzeichen}).length > 0) { 
            alertService.addAlert('error', gettext('Diese produzent existiert bereits'));
            return "";
        } else {
            return $scope.produzent.$save(function() {
              $scope.produzentForm.$setPristine();
            });
        };
      };

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
