'use strict';

angular.module('openolitor').directive('httpSrc', function($http) {
  return {
    restrict: 'A',
    link: function(_scope, _element, attrs) {
      var requestConfig = {
        method: 'GET',
        responseType: 'arraybuffer',
        cache: 'true'
      };

      function base64Img(data) {
        var arr = new Uint8Array(data);
        var raw = '';
        var i, j, subArray, chunk = 5000;
        for (i = 0, j = arr.length; i < j; i += chunk) {
          subArray = arr.subarray(i, i + chunk);
          raw += String.fromCharCode.apply(null, subArray);
        }
        return btoa(raw);
      }

      attrs.$observe('httpSrc', function(srcUrl) {
        if (srcUrl) {
          requestConfig.url = srcUrl;
          $http(requestConfig)
            .then(function(response) {
              attrs.$set('src', 'data:image/jpeg;base64,' + base64Img(response.data));
            });
        }
      });
    }
  };
});
