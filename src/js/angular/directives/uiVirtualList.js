// Directive and concept adapted from Raúl Jiménez:
// http://twofuckingdevelopers.com/2014/11/angularjs-virtual-list-directive-tutorial/
angular.module('editorial')
.directive('uiVirtualList', ['$timeout', 'Hit', function ($timeout, Hit) {
  'use strict';

  return {
    restrict: 'E',
    template: '<ng-include src="getTemplateUrl()" />',
    scope: {
      uiDataProvider: '=',
      bulkData: '=',
      dataParser: '&'
    },
    link: function (scope, elem, attrs) {
      var rowHeight = 25,
          calculatedHeight,
          calculatedWidth,
          containerHeight,
          fullHeight,
          fullData;

      scope.scrollTop = 0;
      scope.visibleProvider = [];
      scope.cellsPerPage = 0;
      scope.numberOfCells = 0;
      scope.canvasHeight = {};
      scope.getTemplateUrl = function () {
        return attrs.templateUrl;
      };

      function resize () {
        calculatedHeight = window.innerHeight - (+attrs.offset);
        calculatedWidth = elem.width() - 20;
        containerHeight = calculatedHeight > 200 ? calculatedHeight : 200;
        elem.height(containerHeight);
          
        scope.cellsPerPage = Math.round(containerHeight / rowHeight);
        scope.numberOfCells = 3 * scope.cellsPerPage;

        // Set Current hit, for navigating between topics
        scope.setCurrentHit = function (elemID) {
          var indexes = $.map(fullData, function (obj, index) {
            if(obj.id == elemID) {
              return index;
            }
          });

          Hit.setCurrentHit(indexes[0]);
        };

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var offset = 0;
        context.font = '14px Helvetica Neue';
    
        fullHeight = 0;
        for (var i = 0; i < fullData.length; i++) {
          fullData[i].styles = {
            top: fullHeight + 'px'
          };
          fullData[i].top = fullHeight;
          offset = rowHeight + (15 * Math.floor(context.measureText(fullData[i].display_name).width/calculatedWidth));
          fullHeight += offset;
        }
        
        scope.canvasHeight = {
          height: fullHeight
        };

        canvas = null;


        scope.updateDisplayList();
      }

      // Init
      scope.init = function () {
        elem[0].addEventListener('scroll', scope.onScroll);
        resize();
      };

      scope.updateDisplayList = function () {
        // make a (probably high) estimate for first cell
        var firstCell = Math.max(Math.floor(scope.scrollTop / rowHeight) - scope.cellsPerPage, 0);

        // if cell estimate overshoots the end, rest to the last cell  
        if (firstCell > fullData.length-1) {
          firstCell = fullData.length-1;
        }

        // if cell is too high, count backward until in appropriate location
        while ((fullData[firstCell].top > scope.scrollTop - containerHeight) && (firstCell > 0)) {
          firstCell--;
        }


        var cellsToCreate = Math.min(firstCell + scope.numberOfCells, scope.numberOfCells);
        scope.visibleProvider = fullData.slice(firstCell, firstCell + cellsToCreate);
      };

      scope.onScroll = function (evt) {
        scope.scrollTop = elem.prop('scrollTop');
        scope.updateDisplayList();

        scope.$apply();
      };

      scope.$watchCollection('uiDataProvider', function () {
        fullData = scope.uiDataProvider;
        $timeout(scope.init);
      });

      // Browser resize event
      window.onresize = function () {
        resize(); 
      };
    }
  };
}]);
