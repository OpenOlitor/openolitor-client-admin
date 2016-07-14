'use strict';

angular.module('openolitor')
  .factory('FileUtil', function($document, $timeout, $http, API_URL) {

    var openFile = function(filename, arraybuffer, contentType, charset) {
      var defCharset = charset || 'utf-8';
      var defContentType = contentType || '*';
      var blob = new Blob([arraybuffer], {
        type: defContentType + ';charset=' + defCharset + ';'
      });

      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        var regex = /filename[^;=\n]*=((['"])(.*?)\2|[^;\n]*)/;
        var results = regex.exec(filename);
        if (results && results.length > 0) {
          if (results.length > 3 && results[3]) {
            filename = results[3];
          } else if (results.length > 1 && results[1]) {
            filename = results[1];
          }
        }

        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', filename);
        downloadLink.attr('target', '_blank');

        $document.find('body').append(downloadLink);
        $timeout(function() {
          downloadLink[0].click();
          downloadLink.remove();
        }, null);
      }
    };

    return {
      open: openFile,
      download: function(url, defaultFileName, defaultContentType, callback) {
        $http.get(API_URL + url, {
          headers: {
            'Content-Type': undefined
          },
          // angular.identity prevents Angular to do anything on our data (like serializing it).
          transformRequest: angular.identity,
          responseType: 'arraybuffer'
        }).then(function(res) {
          var name = res.headers('Content-Disposition');
          var contentType = res.headers('Content-Type');
          openFile(name || defaultFileName, res.data,
            contentType || defaultContentType);
          if (callback) {
            callback(res);
          }
        });
      }
    };
  });
