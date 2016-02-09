'use strict';

angular.module('openolitor').filter('ooPreisProEinheit', function(gettext) {
  return function(value) {
    var result = '' +
      gettext(value.waehrung) + ' ' +
      value.preis + ' ' +
      gettext('pro') + ' ' +
      gettext(value.preiseinheit);

    return result;
  };
});
