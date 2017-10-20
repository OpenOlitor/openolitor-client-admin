'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('AbotypenDetailController', ['$scope', '$filter', '$routeParams',
    '$location', 'gettext', 'NgTableParams', 'AbotypenDetailModel','ZusatzAbotypenDetailModel', 'msgBus',
    'LIEFERRHYTHMEN', 'PREISEINHEITEN', 'LAUFZEITEINHEITEN', 'FRISTEINHEITEN',
    'EnumUtil',
    function($scope, $filter, $routeParams, $location, gettext, NgTableParams,
      AbotypenDetailModel, ZusatzAbotypenDetailModel, msgBus, LIEFERRHYTHMEN, PREISEINHEITEN,
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

      $scope.colorPickerOptions = {
        alpha: false,
        format: 'hex'
      };

      $scope.getModel  = function(){
        return $location.path().split('/')[1];
      };

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
            $scope.zusatzAbotyp = new ZusatzAbotypenDetailModel(defaults.model);
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
            ZusatzAbotypenDetailModel.get({
                id: $routeParams.id
            }, function(result) {
                $scope.zusatzAbotyp = result;

                var msg = {
                    type: 'ZusatzAbotypLoaded',
                    zusatzAbotyp: $scope.zusatzAbotyp
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

     $scope.$watch('zusatzAbotyp.farbCode', function(newValue) {
        if (newValue) {
            $scope.abotypStyle = {
                'background-color': $scope.zusatzAbotyp.farbCode
            };
        }
      });

      $scope.isExisting = function() {
        if ($scope.getModel() === 'abotypen'){
            return angular.isDefined($scope.abotyp) && angular.isDefined($scope.abotyp.id);
        } else {
            return angular.isDefined($scope.zusatzAbotyp) && angular.isDefined($scope.zusatzAbotyp.id);
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
            return $scope.zusatzAbotyp.$save();
        }
      };

      $scope.backToList = function() {
        if ($scope.getModel() === 'abotypen'){
            $location.path('/abotypen');
        }else{
            $location.path('/zusatzAbotypen');
        }
      };

      $scope.created = function(id) {
        if ($scope.getModel() === 'abotypen'){
            $location.path('/abotypen/' + id);
        }else{
            $location.path('/zusatzAbotypen/' + id);
        }
      };

      $scope.delete = function() {
        if ($scope.getModel() === 'abotypen'){
            return $scope.abotyp.$delete();
        }else{
            return $scope.zusatzAbotyp.$delete();
        }
      };

      msgBus.onMsg('VertriebSelected', $scope, function(event, msg) {
        $scope.selectedVertrieb = msg.vertrieb;
        $scope.showSelectedVertrieb = false;
      });

      $scope.unselectVertriebFunct = function() {  
        $scope.showSelectedVertrieb = false;
      };
    }
  ]);
