'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbosDetailController', ['$scope', '$filter', '$routeParams', 'createKundeId',
    '$location', 'gettext', 'AbosDetailModel', 'AbotypenOverviewModel',
    'AbotypenDetailModel', 'KundenDetailModel', 'VertriebsartenListModel', 'VERTRIEBSARTEN',
    'ABOTYPEN_ARRAY',
    function($scope, $filter, $routeParams, createKundeId, $location, gettext,
      AbosDetailModel, AbotypenOverviewModel, AbotypenDetailModel,
      KundenDetailModel, VertriebsartenListModel, VERTRIEBSARTEN, ABOTYPEN_ARRAY) {

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

      if (!$routeParams.id) {
        KundenDetailModel.get({
          id: getKundeId()
        }, function(kunde) {
          $scope.kunde = kunde;
          $scope.abo = new AbosDetailModel(defaults.model);
          $scope.abo.kundeId = $scope.kunde.id;
          $scope.abo.kunde = $scope.kunde.bezeichnung;
        });
      } else {
        KundenDetailModel.get({
          id: getKundeId()
        }, function(kunde) {
          $scope.kunde = kunde;
        });

        AbosDetailModel.get({
          id: $routeParams.id,
          kundeId: getKundeId()
        }, function(result) {
          $scope.abo = result;
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
          abotypId: $routeParams.id
        }, function() {
          angular.forEach(abotyp.vertriebsarten, function(vertriebsart) {
            $scope.vertriebsartPermutations.push({
              label: vertriebsartLabel(vertriebsart),
              vertriebsart: vertriebsart
            });
            if ($scope.isExisting() && vertriebsart.depot.id === $scope.abo
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
