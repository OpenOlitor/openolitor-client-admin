'use strict';

/**
 */
angular.module('openolitor')
  .controller('KundenDetailController', ['$scope', '$filter', '$routeParams', '$location', 'gettext', 'KundenDetailModel', 'KUNDENTYPEN', function($scope, $filter, $routeParams, $location, gettext, KundenDetailModel, KUNDENTYPEN) {

    var defaults = {
      model: {
        id: undefined,
        typen: [KUNDENTYPEN.VEREINSMITGLIED],
        personen: [
          {
            id: undefined
          }
        ]
      }
    };

    if (!$routeParams.id) {
      $scope.kunde = new KundenDetailModel(defaults.model);
    } else {
      KundenDetailModel.get({
        id: $routeParams.id
      }, function(result) {
        $scope.person = result;
      });
    }

    $scope.fullName = function() {
      if ($scope.kunde && $scope.kunde.bezeichnung) {
        return $scope.person.bezeichnung;
      }
      return undefined;
    };

    $scope.isExisting = function() {
      return angular.isDefined($scope.kunde) && angular.isDefined($scope.kunde.id);
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
  }]);
