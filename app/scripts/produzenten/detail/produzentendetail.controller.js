'use strict';

/**
 */
angular.module('openolitor')
  .controller('ProduzentenDetailController', ['$scope', '$filter', '$routeParams',
    '$location', '$uibModal', 'gettext', 'ProduzentDetailModel', '$log',
    function($scope, $filter, $routeParams, $location, $uibModal, gettext,
      ProduzentDetailModel, $log) {

      var defaults = {
        model: {
          id: undefined,
          aktiv: true,
          mwst: false
        }
      };

      if (!$routeParams.id) {
        $scope.produzent = new ProduzentDetailModel(defaults.model);
      } else {
        ProduzentDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.produzent = result;
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
        return $scope.produzent.$save();
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
