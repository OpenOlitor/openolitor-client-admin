'use strict';

//Based on https://github.com/logicbomb/lvlDragDrop

angular.module('openolitor').directive('ooDraggable', ['$rootScope', 'uuid', function ($rootScope, uuid) {
    return {
        restrict: 'A',
        scope: {
            ooDragedType: '='
        },
        link: function (scope, el, attrs, controller) {
            angular.element(el).attr('draggable', 'true');

            var id = angular.element(el).attr('id');

            if (!id) {
                id = uuid.new();
                angular.element(el).attr('id', id);
            }
            el.bind('dragstart', function (e) {
                e.originalEvent.dataTransfer.setData('text', '{ \"data\": \"' + id + '\", \"type\": \"' + scope.ooDragedType + '\" }');
                $rootScope.$emit('OO-DRAG-START');
            });

            el.bind('dragend', function (e) {
                $rootScope.$emit('OO-DRAG-END');
            });
        }
    };
}]);

angular.module('openolitor').directive('ooDropTarget', ['$rootScope', 'uuid', function ($rootScope, uuid) {
    return {
        restrict: 'A',
        scope: {
            onDrop: '&'
        },
        link: function (scope, el, attrs, controller) {
            var id = angular.element(el).attr('id');
            var enteredCounter = 0;
            if (!id) {
                id = uuid.new();
                angular.element(el).attr('id', id);
            }

            el.bind('dragover', function (e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            });

            el.bind('dragenter', function (e) {
              if (e.preventDefault) {
                  e.preventDefault(); // Necessary. Allows us to drop.
              }
              if(enteredCounter === 0) {
                angular.element('#'+id).addClass('oo-over');
              }
              enteredCounter += 1;
            });

            el.bind('dragleave', function (e) {
              if (e.preventDefault) {
                  e.preventDefault(); // Necessary. Allows us to drop.
              }
              enteredCounter -= 1;
              if(enteredCounter === 0) {
                angular.element('#'+id).removeClass('oo-over');  // this / e.target is previous target element.
              }
            });

            el.bind('drop', function (e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                if (e.stopPropagation) {
                    e.stopPropagation(); // Necessary. Allows us to drop.
                }
                var dataRaw = e.originalEvent.dataTransfer.getData('text');
                var dataObj = JSON.parse(dataRaw);

                var data = dataObj.data;
                var type = dataObj.type;

                enteredCounter = 0;
                $rootScope.$emit('OO-DRAG-END');
                scope.onDrop({dragEl: data, dropEl: id, type: type});
            });

            $rootScope.$on('OO-DRAG-START', function () {
                var el = document.getElementById(id);
                angular.element(el).addClass('oo-target');
            });

            $rootScope.$on('OO-DRAG-END', function () {
                var el = angular.element('#'+id);
                el.removeClass('oo-target');
                el.removeClass('oo-over');
            });
        }
    };
}]);
