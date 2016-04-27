'use strict';

angular.module('openolitor')
  .factory('EnumUtil', function(gettext) {
    return {
      asArray: function(e) {
        var result = [];
        angular.forEach(e, function(value) {
          this.push({
            id: value.id || value,
            label: value.label && value.label.long && gettext(value
              .label.long) || gettext(value),
            shortLabel: value.label && value.label.short && gettext(
              value.label.short) || gettext(value),
            title: gettext(value),
            value: value.value || value
          });
        }, result);

        return result;
      }
    };
  });
