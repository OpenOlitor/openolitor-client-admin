'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('AbotypenDetailController', ['$scope', '$filter', '$routeParams',
    '$location', 'gettext', 'NgTableParams', 'AbotypenDetailModel','ZusatzabotypenDetailModel', 'msgBus',
    'LIEFERRHYTHMEN', 'PREISEINHEITEN', 'LAUFZEITEINHEITEN', 'FRISTEINHEITEN',
    'EnumUtil',
    function($scope, $filter, $routeParams, $location, gettext, NgTableParams,
      AbotypenDetailModel, ZusatzabotypenDetailModel, msgBus, LIEFERRHYTHMEN, PREISEINHEITEN,
      LAUFZEITEINHEITEN, FRISTEINHEITEN,
      EnumUtil) {

      var defaults = {
        model: {
          id: undefined,
          lieferrhythmus: LIEFERRHYTHMEN.WOECHENTLICH,
          preiseinheit: PREISEINHEITEN.LIEFERUNG,
          laufzeiteinheit: LAUFZEITEINHEITEN.UNBESCHRAENKT,
          waehrung: 'CHF',
          anzahlAbwesenheiten: undefined,
          farbCode: '',
          adminProzente: 0,
          wirdGeplant: true,
          aktiv: 1
        }
      };

      $scope.getModel  = function(){
        return $location.path().split('/')[1]
      }

      $scope.unbeschraenkt = LAUFZEITEINHEITEN.UNBESCHRAENKT;
      $scope.selectedVertrieb = undefined;

      $scope.open = {
        aktivVon: false,
        aktivBis: false
      };
      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      $scope.lieferrhythmen = EnumUtil.asArray(LIEFERRHYTHMEN);

      $scope.preiseinheiten = EnumUtil.asArray(PREISEINHEITEN);

      $scope.laufzeiteinheiten = EnumUtil.asArray(LAUFZEITEINHEITEN);

      $scope.fristeinheiten = EnumUtil.asArray(FRISTEINHEITEN);

      $scope.abotypStyle = {};

      if (!$routeParams.id) {
        if ($scope.getModel()=== 'abotypen'){
            $scope.abotyp = new AbotypenDetailModel(defaults.model);
        }else{
            $scope.zusatzabotyp = new ZusatzabotypenDetailModel(defaults.model);
        }
      } else {
        if ($scope.getModel() === 'abotypen'){
            AbotypenDetailModel.get({
                id: $routeParams.id
            }, function(result) {
                $scope.abotyp = result;

                var msg = {
                    type: 'AbotypLoaded',
                    abotyp: $scope.abotyp
                };
                msgBus.emitMsg(msg);
            });
        }else{
            ZusatzabotypenDetailModel.get({
                id: $routeParams.id
            }, function(result) {
                $scope.zusatzabotyp = result;

                var msg = {
                    type: 'ZusatzabotypLoaded',
                    zusatzabotyp: $scope.zusatzabotyp
                };
                msgBus.emitMsg(msg);
            }
            );
        }
      }

      $scope.$watch('abotyp.farbCode', function(newValue) {
        if (newValue) {
            $scope.abotypStyle = {
                'background-color': $scope.abotyp.farbCode
            };
        }
      });

      $scope.isExisting = function() {
        if ($scope.getModel() === 'abotypen'){
            return angular.isDefined($scope.abotyp) && angular.isDefined($scope.abotyp.id);
        } else {
            return angular.isDefined($scope.zusatzabotyp) && angular.isDefined($scope.zusatzabotyp.id);
        }
      };

      $scope.isVertriebExisting = function() {
        return angular.isDefined($scope.selectedVertrieb) && angular.isDefined(
          $scope.selectedVertrieb.id);
      };

      $scope.save = function() {
        if ($scope.getModel() === 'abotypen'){
            return $scope.abotyp.$save();
        }else{
            return $scope.zusatzabotyp.$save();
        }
      };

      $scope.backToList = function() {
        if ($scope.getModel() === 'abotypen'){
            $location.path('/abotypen');
        }else{
            $location.path('/zusatzabotypen');
        }
      };

      $scope.created = function(id) {
        if ($scope.getModel() === 'abotypen'){
            $location.path('/abotypen/' + id);
            console.log("Mikel --------------> abotypen");
        }else{
            $location.path('/zusatzabotypen/' + id);
            console.log("Mikel --------------> zusatzabotypen");
        }
      };

      $scope.delete = function() {
        if ($scope.getModel() === 'abotypen'){
            return $scope.abotyp.$delete();
        }else{
            return $scope.zusatzabotyp.$delete();
        }
      };

      msgBus.onMsg('VertriebSelected', $scope, function(event, msg) {
        $scope.selectedVertrieb = msg.vertrieb;
      });
    }
  ]);
