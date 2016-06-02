'use strict';

angular.module('openolitor')
  .factory('FileUtil', function($document, $timeout) {
    return {
      download: function(filename, file, contentType, charset) {
              var defCharset = charset || 'utf-8';
              var defContentType = contentType || '*';
              var blob = new Blob([file], {
                type: defContentType+';charset='+ defCharset + ';'
              });

              if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
              } else {

                var downloadLink = angular.element('<a></a>');
                downloadLink.attr('href', window.URL.createObjectURL(blob));
                downloadLink.attr('download', filename);
                downloadLink.attr('target', '_blank');

                $document.find('body').append(downloadLink);
                $timeout(function () {
                  downloadLink[0].click();
                  downloadLink.remove();
                }, null);
              }
            }
          };
        });
