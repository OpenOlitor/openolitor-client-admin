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
          personen: [{
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
        if ($scope.kunde && $scope.kunde.personen) {
          if ($scope.kunde.personen.length > 1) {
            return $scope.kunde.bezeichnung;
          } else {
            return $scope.fullName(0);
          }
        }
        return undefined;
      };

      $scope.personInfos = function(index) {
        var name = '';
        if ($scope.kunde.personen[index].email) {
          name = name + ', ' + $scope.kunde.personen[index].email;
        }
        if ($scope.kunde.personen[index].telefonMobil) {
          name = name + ', ' + $scope.kunde.personen[index].telefonMobil;
        }
        if ($scope.kunde.personen[index].telefonFestnetz) {
          name = name + ', ' + $scope.kunde.personen[index].telefonFestnetz;
        }
        return name;
      }

      $scope.personClass = function(index) {
        if ($scope.kunde.personen[index].id === undefined) {
          return "in";
        }
      }

      $scope.fullName = function(index) {
        if ($scope.kunde && $scope.kunde.personen && $scope.kunde.personen[
            index] && $scope.kunde.personen[index].vorname && $scope.kunde.personen[
            index].name) {
          return $scope.kunde.personen[index].vorname + ' ' + $scope.kunde.personen[
            index].name;
        }
        return undefined;
      };

      $scope.addPerson = function() {
        $scope.kunde.personen.push({
          id: undefined
        });
      }

      $scope.isExisting = function() {
        return angular.isDefined($scope.kunde) && angular.isDefined($scope.kunde
          .id);
      };

      $scope.save = function() {
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
