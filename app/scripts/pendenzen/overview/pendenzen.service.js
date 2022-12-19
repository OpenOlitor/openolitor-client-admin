'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('PendenzenService', ['$rootScope', 
    function($rootScope) {
      var regexAbo = /Abo Nr.: \d\d\d\d\d|Abo Nr.:\d\d\d\d\d/g;
      var regexCode = /\d\d\d\d\d/g;

      return {renderText(text ) {
        if (text !== undefined) {
          var foundValue = text.match(regexAbo);
          if (foundValue) {
            var code = text.match(regexCode);
            var value = text.replace(foundValue, foundValue + ' <a target="_blank" rel="noopener noreferrer" href="#/abos?q=id%3D' + code + '"><i class="glyphicon small glyphicon-new-window"></i></a></b>')
            return value;
          } else {
            return text;
          }
        } else return '';
      }
      };
    }
  ]);
