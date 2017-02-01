'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ArbeitsangeboteDetailController', ['$scope', '$filter', '$routeParams',
    '$location', 'gettext', 'ArbeitsangeboteDetailModel', 'ARBEITSEINSATZSTATUS',
    function($scope, $filter, $routeParams, $location, gettext,
      ArbeitsangeboteDetailModel, ARBEITSEINSATZSTATUS) {

      var defaults = {
        model: {
          id: undefined,
          arbeitskategorien: [],
          mehrPersonenOk: true,
          status: ARBEITSEINSATZSTATUS.INVORBEREITUNG
        }
      };

      $scope.tpOptionsVon = {
        showMeridian: false
      };

      $scope.tpOptionsBis = {
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

      // watch min and max dates to calculate difference
      var unwatchMinMaxValues = $scope.$watch(function() {
        var von = !angular.isUndefined($scope.arbeitsangebot) ? $scope.arbeitsangebot.zeitVon : undefined;
        var bis = !angular.isUndefined($scope.arbeitsangebot) ? $scope.arbeitsangebot.zeitBis : undefined;
        return [von, bis];
      }, function() {
        if(angular.isUndefined($scope.arbeitsangebot)) {
          return;
        }
        // min max dates
        $scope.tpOptionsVon.maxDate = $scope.arbeitsangebot.zeitBis;
        $scope.tpOptionsBis.minDate = $scope.arbeitsangebot.zeitVon;

        if ($scope.arbeitsangebot.zeitVon && $scope.arbeitsangebot.zeitBis) {
            var diff = $scope.arbeitsangebot.zeitVon.getTime() - $scope.arbeitsangebot.zeitBis.getTime();
            $scope.arbeitsangebot.einsatzZeit = Math.abs(diff/(1000*60*60));
        } else {
            $scope.arbeitsangebot.einsatzZeit = '';
        }

        // min max times
        $scope.tpOptionsVon.max = $scope.arbeitsangebot.zeitBis;
        $scope.tpOptionsBis.min = $scope.arbeitsangebot.zeitVon;
      }, true);

      $scope.actions = [{
        labelFunction: function() {
          return 'Person hinzufügen';
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          return undefined;
        }
      }];

      // destroy watcher
      $scope.$on('$destroy', function() {
          unwatchMinMaxValues();
      });

    }
  ]);
