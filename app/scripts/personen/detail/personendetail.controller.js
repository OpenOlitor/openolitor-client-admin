'use strict';

/**
 */
angular.module('openolitor')
  .controller('PersonenDetailController', ['$scope', '$filter', '$routeParams', '$location', 'gettext', 'PersonenDetailModel', 'PERSONENTYPEN', function($scope, $filter, $routeParams, $location, gettext, PersonenDetailModel, PERSONENTYPEN) {

    var defaults = {
      model: {
        id: undefined,
        typen: [PERSONENTYPEN.VEREINSMITGLIED]
      }
    };

    if (!$routeParams.id) {
      $scope.person = new PersonenDetailModel(defaults.model);
    } else {
      PersonenDetailModel.get({
        id: $routeParams.id
      }, function(result) {
        $scope.person = result;
      });
    }

    $scope.fullName = function() {
      if ($scope.person && $scope.person.vorname && $scope.person.name) {
        return $scope.person.vorname + ' ' + $scope.person.name;
      }
      return undefined;
    };

    $scope.isExisting = function() {
      return angular.isDefined($scope.person) && angular.isDefined($scope.person.id) && !$location.path().endsWith('new');
    };

    $scope.save = function() {
      $scope.person.$save(function(result) {
        if (!$scope.isExisting()) {
          $location.path('/personen/' + result.id);
        }
      });
    };

    $scope.cancel = function() {
      $location.path('/personen');
    };

    $scope.delete = function() {
      $scope.person.$delete();
    };
  }]);
