'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('PendenzenService', ['$rootScope', 
    function($rootScope) {
      var regexAbo = /Abo Nr.: \d+|Abo Nr.:\d+/g;
      var regexCode = /\d+/g;

      return {renderText(text ) {
        if (text !== undefined) {
          var foundValue = text.match(regexAbo);
          if (foundValue) {
            var code = foundValue[0].match(regexCode);
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
