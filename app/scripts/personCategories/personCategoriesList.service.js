'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('PersonCategoriesService', ['$rootScope', 'PersonCategoriesModel', 'msgBus',
    function($rootScope, PersonCategoriesModel, msgBus) {

      var personCategories;

      var load = function() {
        PersonCategoriesModel.query({}, function(result) {
          personCategories = result;
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'PersonCategory') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'PersonCategory') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'PersonCategory') {
          load();
          $rootScope.$apply();
        }
      });

      return {
        getPersonCategories : function() {
          return personCategories;
        },
        VEREINSMITGLIED: 'Vereinsmitglied'
      };
    }
  ]);
