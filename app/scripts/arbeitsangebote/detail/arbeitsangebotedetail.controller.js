'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ArbeitsangeboteDetailController', ['$scope', '$filter', '$routeParams',
    '$location', 'gettext', 'ArbeitsangeboteDetailModel',
    function($scope, $filter, $routeParams, $location, gettext,
      ArbeitsangeboteDetailModel) {

      var defaults = {
        model: {
          id: undefined,
          mehrPersonenOk: true
        }
      };

      $scope.tpOptions = {
        showMeridian: false
      };

      if (!$routeParams.id || $routeParams.id === 'new') {
        $scope.arbeitsangebot = new ArbeitsangeboteDetailModel(defaults.model);
      } else {
        ArbeitsangeboteDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.arbeitsangebot = result;
        });
      }

      $scope.delete = function() {
        if ($scope.arbeitsangebot.anzahlAbonnenten > 0) {
          return;
        }
        return $scope.arbeitsangebot.$delete();
      };

      $scope.isExisting = function() {
        return angular.isDefined($scope.arbeitsangebot) && angular.isDefined($scope.arbeitsangebot
          .id);
      };


      $scope.save = function() {
        return $scope.arbeitsangebot.$save();
      };

      $scope.created = function(id) {
        $location.path('/arbeitsangebote/' + id);
      };

      $scope.backToList = function() {
        $location.path('/arbeitsangebote');
      };

      $scope.delete = function() {
        return $scope.arbeitsangebot.$delete();
      };

      $scope.open = {
        start: false,
        ende: false
      };
      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };
    }
  ]);
