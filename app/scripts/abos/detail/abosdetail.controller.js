'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbosDetailController', ['$scope', '$filter', '$routeParams',
    '$location', 'gettext', 'AbosDetailModel', 'AbotypenOverviewModel',
    'AbotypenDetailModel', 'KundenDetailModel', 'VertriebsartenListModel',
    'VERTRIEBSARTEN',
    'ABOTYPEN', 'moment', 'EnumUtil',
    function($scope, $filter, $routeParams, $location, gettext,
      AbosDetailModel, AbotypenOverviewModel, AbotypenDetailModel,
      KundenDetailModel, VertriebsartenListModel, VERTRIEBSARTEN,
      ABOTYPEN, moment, EnumUtil) {

      $scope.VERTRIEBSARTEN = VERTRIEBSARTEN;
      $scope.ABOTYPEN_ARRAY = EnumUtil.asArray(ABOTYPEN).map(function(typ) {
        return typ.id;
      });

      var defaults = {
        model: {
          id: undefined,
          abotypId: undefined
        }
      };

      $scope.open = {
        start: false
      };
      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      var getKundeId = function() {
        if (angular.isDefined($routeParams.kundeId)) {
          return $routeParams.kundeId;
        } else {
          return $scope.kundeId;
        }
      };

      var getAboId = function() {
        if (angular.isDefined($scope.aboId)) {
          return $scope.aboId;
        } else {
          return $scope.id;
        }
      };

      var loadAboDetail = function() {
        if ($scope.loading === getAboId()) {
          return;
        }
        $scope.loading = getAboId();
        AbosDetailModel.get({
          id: getAboId(),
          kundeId: getKundeId()
        }, function(result) {
          $scope.abo = result;
          $scope.loading = false;
          if (!$scope.kunde || $scope.kunde.id !== $scope.abo.kundeId) {
            KundenDetailModel.get({
              id: $scope.abo.kundeId
            }, function(kunde) {
              $scope.kunde = kunde;
            });
          }
        });
      };

      $scope.$watch('aboId', function(id) {
        if (id && (!$scope.abo || $scope.abo.id !== id)) {
          loadAboDetail();
        }
      });

      var basePath = '/abos';
      if ($routeParams.kundeId) {
        basePath = '/kunden/' + $routeParams.kundeId;
      }

      if (!angular.isDefined(getAboId())) {
        KundenDetailModel.get({
          id: getKundeId()
        }, function(kunde) {
          $scope.kunde = kunde;
          $scope.abo = new AbosDetailModel(defaults.model);
          $scope.abo.kundeId = $scope.kunde.id;
          $scope.abo.kunde = $scope.kunde.bezeichnung;
          $scope.abo.start = moment().startOf('day').toDate();
        });
      } else {
        if (!$scope.abo) {
          loadAboDetail();
        }
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
            return vertriebsart.typ + ' - ' + vertriebsart.depot.name +
              ' - ' +
              vertriebsart.liefertag;
          case VERTRIEBSARTEN.HEIMLIEFERUNG:
            return vertriebsart.typ + ' - ' + vertriebsart.tour.name +
              ' - ' +
              vertriebsart.liefertag;
          default:
            return vertriebsart.typ + ' - ' + vertriebsart.liefertag;
        }
      }

      function createPermutations(abotyp) {
        $scope.vertriebsartPermutations = [];
        abotyp.vertriebsarten = VertriebsartenListModel.query({
          abotypId: $scope.abo.abotypId
        }, function() {
          angular.forEach(abotyp.vertriebsarten, function(
            vertriebsart) {
            $scope.vertriebsartPermutations.push({
              label: vertriebsartLabel(vertriebsart),
              vertriebsart: vertriebsart
            });
            if ($scope.isExisting() && angular.isDefined(
                vertriebsart
                .depot) && vertriebsart.depot.id === $scope.abo
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
              $scope.abo.liefertag = vertriebsart.liefertag;
              break;
          }
        }
      });

      $scope.aboSaldo = function(abo) {
        if (!abo) {
          return;
        }
        return abo.saldo + abo.saldoInRechnung;
      };

      $scope.saldoTooltip = function(abo) {
        return abo.saldo + ' ' + gettext('bezahlt') + ' + ' + abo.saldoInRechnung +
          ' ' + gettext('verrechnet') + ' = ' + $scope.aboSaldo(abo) + ' ' +
          gettext('total');
      };

      $scope.vertriebsart = function() {
        if (!$scope.abo) {
          return;
        }
        if ($scope.abo.depot) {
          return gettext(VERTRIEBSARTEN.DEPOTLIEFERUNG);
        } else if ($scope.abo.tour) {
          return gettext(VERTRIEBSARTEN.HEIMLIEFERUNG);
        } else {
          return gettext(VERTRIEBSARTEN.POSTLIEFERUNG);
        }
      };

      $scope.saldoClass = function(abo) {
        if (abo && abo.abotyp && ($scope.aboSaldo(abo) < abo.abotyp.saldoMindestbestand)) {
          return 'error';
        } else if (abo && ($scope.aboSaldo(abo) < 0)) {
          return 'warning';
        } else {
          return '';
        }
      };
    }
  ]);
