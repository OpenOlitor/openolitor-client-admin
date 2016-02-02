'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbosDetailController', ['$scope', '$filter', '$routeParams',
    '$location', 'gettext', 'AbosDetailModel', 'AbotypenOverviewModel',
    'AbotypenDetailModel', 'KundenDetailModel', 'VertriebsartenListModel', 'VERTRIEBSARTEN',
    'ABOTYPEN_ARRAY', 'createKundeId',
    function($scope, $filter, $routeParams, $location, gettext,
      AbosDetailModel, AbotypenOverviewModel, AbotypenDetailModel,
      KundenDetailModel, VertriebsartenListModel, VERTRIEBSARTEN, ABOTYPEN_ARRAY, createKundeId) {

      $scope.VERTRIEBSARTEN = VERTRIEBSARTEN;
      $scope.ABOTYPEN_ARRAY = ABOTYPEN_ARRAY;

      var defaults = {
        model: {
          id: undefined,
          abotypId: undefined
        }
      };

      var getKundeId = function() {
        if(angular.isDefined($routeParams.kundeId)) {
          return $routeParams.kundeId;
        } else {
          return createKundeId;
        }
      };

      var basePath = '/abos';
      if ($routeParams.kundeId) {
        basePath = '/kunden/' + $routeParams.kundeId;
      }

      if (angular.isDefined(createKundeId)) {
        KundenDetailModel.get({
          id: getKundeId()
        }, function(kunde) {
          $scope.kunde = kunde;
          $scope.abo = new AbosDetailModel(defaults.model);
          $scope.abo.kundeId = $scope.kunde.id;
          $scope.abo.kunde = $scope.kunde.bezeichnung;
        });
      } else {
        AbosDetailModel.get({
          id: $routeParams.id,
          kundeId: $routeParams.id
        }, function(result) {
          $scope.abo = result;
          KundenDetailModel.get({
            id: $scope.abo.kundeId
          }, function(kunde) {
            $scope.kunde = kunde;
          });
        });
      }

      $scope.abotypen = AbotypenOverviewModel.query({
        aktiv: true
      });

      $scope.isExisting = function() {
        return angular.isDefined($scope.abo) && angular.isDefined($scope.abo
          .id);
      };

      $scope.save = function() {
        return $scope.abo.$save();
      };

      $scope.backToList = function(id) {
        if ($routeParams.kundeId) {
          $location.path(basePath);
        } else {
          $location.path(basePath + '/' + id);
        }
      };

      $scope.cancel = function() {
        $location.path(basePath);
      };

      $scope.delete = function() {
        return $scope.abo.$delete();
      };

      function vertriebsartLabel(vertriebsart) {
        switch (vertriebsart.typ) {
          case VERTRIEBSARTEN.DEPOTLIEFERUNG:
            return vertriebsart.typ + ' - ' + vertriebsart.depot.name;
          case VERTRIEBSARTEN.HEIMLIEFERUNG:
            return vertriebsart.typ + ' - ' + vertriebsart.tour.name;
          default:
            return vertriebsart.typ;
        }
      }

      function createPermutations(abotyp) {
        $scope.vertriebsartPermutations = [];
        abotyp.vertriebsarten = VertriebsartenListModel.query({
          abotypId: $scope.abo.abotypId
        }, function() {
          angular.forEach(abotyp.vertriebsarten, function(vertriebsart) {
            $scope.vertriebsartPermutations.push({
              label: vertriebsartLabel(vertriebsart),
              vertriebsart: vertriebsart
            });
            if ($scope.isExisting() && angular.isDefined(vertriebsart.depot) && vertriebsart.depot.id === $scope.abo
              .depotId) {
              $scope.abo.vertriebsart = vertriebsart;
            }
          });
        });
      }

      $scope.$watch('abo.abotypId', function(abotypId) {
        if (abotypId) {
          AbotypenDetailModel.get({
            id: abotypId
          }, function(abotyp) {
            $scope.abotyp = abotyp;
            $scope.abo.abotypName = abotyp.name;
            createPermutations($scope.abotyp);
          });
        }
      });

      $scope.$watch('abo.vertriebsart', function(vertriebsart) {
        if (vertriebsart) {
          switch (vertriebsart.typ) {
            case VERTRIEBSARTEN.DEPOTLIEFERUNG:
              $scope.abo.depotId = vertriebsart.depot.id;
              $scope.abo.depotName = vertriebsart.depot.name;
              $scope.abo.liefertag = vertriebsart.liefertag;
              break;
            case VERTRIEBSARTEN.HEIMLIEFERUNG:
              $scope.abo.tourId = vertriebsart.tour.id;
              $scope.abo.tourName = vertriebsart.tour.name;
              break;
          }
        }
      });
    }
  ]);
