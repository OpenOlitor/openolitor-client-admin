'use strict';

angular.module('openolitor')
  .factory('FilterQueryUtil', function() {
    var regex = /(\w+?)\s*(<=|>=|!=|=|<|>)\s*(.+?)\s*(;| |$)/g;
    var dateRegex = /(\d{2})\.(\d{2})\.(\d{4})/g;

    function replaceValue(input) {
      var result = '';
      var found;

      result = input.replace(dateRegex, function(match, day, month, year) {
        return year + '-' + month + '-' + day;
      });

      return result;
    }

    return {
      transform: function(input) {
        var result = '';
        var found;

        while ((found = regex.exec(input)) !== null) {
          var attribute = found[1];
          var operator = found[2];
          var value = replaceValue(found[3]);

          var operatorFunction = operator
            .replace('>=', '=~gte')
            .replace('<=', '=~lte')
            .replace('>', '=~gt')
            .replace('<', '=~lt')
            .replace('!=', '=~!');

          if(operatorFunction !== operator) {
            result = result.concat(attribute, operatorFunction + '(' + value + ')' + ';');
          } else {
            result = result.concat(attribute, operatorFunction, value + ';');
          }
        }

        return result;
      },

      withoutFilters: function(input) {
        var result = '';
        result = input.replace(regex, '');
        result = result.trim();
        return result;
      }
    };
  });
