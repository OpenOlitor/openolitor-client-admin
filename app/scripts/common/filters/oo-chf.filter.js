'use strict';

angular.module('openolitor').filter('ooCHF', ['$filter', function($filter) {
  return function(value, showTag) {
    var result = '';
    if(showTag) {
      result += 'CHF ';
    }
    result += $filter('number')(value, 2);
    return result;
  };
}]);
