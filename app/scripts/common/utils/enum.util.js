'use strict';

angular.module('openolitor')
  .factory('EnumUtil', function(gettext) {
    return {
      asArray: function(e) {
        var result = [];
        angular.forEach(e, function(value) {
          this.push({
            id: value,
            label: gettext(value)
          });
        }, result);

        return result;
      }
    };
  });
