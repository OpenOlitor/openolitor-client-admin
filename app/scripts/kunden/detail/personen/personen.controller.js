'use strict';

/**
 */
angular.module('openolitor')
  .controller('PersonenListController', ['$scope', '$routeParams',
    'EnumUtil', 'msgBus',
    'PersonenListModel', 'ANREDE',

    function($scope, $routeParams, EnumUtil,
      msgBus, PersonenListModel, ANREDE) {

      $scope.anreden = EnumUtil.asArray(ANREDE);
      $scope.loading = false;

      $scope.addPerson = function(typ) {
        var newModel = new PersonenListModel({
          id: undefined,
          kundeId: $routeParams.id
        });

        $scope.ansprechpersonen.push(newModel);
      };

      $scope.updatePerson = function(person) {
        $scope.updatingPerson[person.id] = true;
        person.$save();
      };

      $scope.deletePerson = function(person) {
        if (person.id) {
          $scope.updatingPerson[person.id] = true;
          person.$delete();
        } else {
          var index = $scope.ansprechpersonen.indexOf(person);
          if (index > -1) {
            $scope.ansprechpersonen.splice(index, 1);
          }
        }
      };

      function load() {
        if ($scope.loading) {
          return;
        }

        $scope.loading = true;
        $scope.ansprechpersonen = PersonenListModel.query({
          kundeId: $routeParams.id
        }, function() {
          $scope.loading = false;
        });
      }

      load();

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (msg.entity === 'Person') {
          $scope.updatingPerson[msg.data.id] = undefined;

          $scope.ansprechpersonen.push(new PersonenListModel(msg.data));

          $scope.$apply();
        }
      });
    }
  ]);
