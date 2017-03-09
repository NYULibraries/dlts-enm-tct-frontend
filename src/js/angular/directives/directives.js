// Directive for forms to convert text elements to numbers
angular.module('editorial')
.directive('convertToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function(val) {
        return '' + val;
      });
    }
  };
});

// Generic form cancel button
angular.module('editorial')
.directive('cancelButton', function () {
  return {
    restrict: 'E',
    scope: {
      showForm:'=stateVariable',
    },

    link: function (scope, element, attributes) {
      scope.buttonText = ('buttonText' in attributes) ? attributes.buttonText : 'Cancel';

      element.on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        
        scope.showForm.show = false;
        scope.$apply();
      });
    },
    templateUrl: 'templates/includes/cancelButton.html'
  };
});
