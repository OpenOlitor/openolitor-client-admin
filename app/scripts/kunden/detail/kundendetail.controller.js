'use strict';

/**
 */
angular.module('openolitor')
  .controller('KundenDetailController', ['$scope', '$filter', '$routeParams',
    '$location', 'gettext', 'KundenDetailModel', 'KUNDENTYPEN',
    function($scope, $filter, $routeParams, $location, gettext,
      KundenDetailModel, KUNDENTYPEN) {

      var defaults = {
        model: {
          id: undefined,
          typen: [KUNDENTYPEN.VEREINSMITGLIED],
          ansprechpersonen: [{
            id: undefined
          }]
        }
      };

      if (!$routeParams.id) {
        $scope.kunde = new KundenDetailModel(defaults.model);
      } else {
        KundenDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.kunde = result;
        });
      }

      $scope.kundeBezeichnung = function() {
        if ($scope.kunde && $scope.kunde.ansprechpersonen) {
          if ($scope.kunde.ansprechpersonen.length > 1) {
            return $scope.kunde.bezeichnung;
          } else {
            return $scope.fullName(0);
          }
        }
        return undefined;
      };

      $scope.personInfos = function(index) {
        var name = '';
        if ($scope.kunde.ansprechpersonen[index].email) {
          name = name + ', ' + $scope.kunde.ansprechpersonen[index].email;
        }
        if ($scope.kunde.ansprechpersonen[index].telefonMobil) {
          name = name + ', ' + $scope.kunde.ansprechpersonen[index].telefonMobil;
        }
        if ($scope.kunde.ansprechpersonen[index].telefonFestnetz) {
          name = name + ', ' + $scope.kunde.ansprechpersonen[index].telefonFestnetz;
        }
        return name;
      }

      $scope.personClass = function(index) {
        if ($scope.kunde.ansprechpersonen[index].id === undefined) {
          return "in";
        }
      }

      $scope.fullName = function(index) {
        if ($scope.kunde && $scope.kunde.ansprechpersonen && $scope.kunde.ansprechpersonen[
            index] && $scope.kunde.ansprechpersonen[index].vorname &&
          $scope.kunde.ansprechpersonen[
            index].name) {
          return $scope.kunde.ansprechpersonen[index].vorname + ' ' +
            $scope.kunde.ansprechpersonen[
              index].name;
        }
        return undefined;
      };

      $scope.addPerson = function() {
        $scope.kunde.ansprechpersonen.push({
          id: undefined
        });
      }

      $scope.removePerson = function(index) {
        $scope.kunde.ansprechpersonen.splice(index, 1);
      }

      $scope.isExisting = function() {
        return angular.isDefined($scope.kunde) && angular.isDefined($scope.kunde
          .id);
      };

      $scope.save = function() {
        //force rewriting of ansprechperson
        if ($scope.kunde.ansprechpersonen.length === 1) {
          $scope.kunde.bezeichnung = undefined;
        }
        $scope.kunde.$save();
      };

      $scope.created = function(id) {
        $location.path('/kunden/' + id);
      };

      $scope.backToList = function() {
        $location.path('/kunden');
      };

      $scope.delete = function() {
        $scope.kunde.$delete();
      };
    }
  ]);
