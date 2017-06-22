//filter via http://stackoverflow.com/a/31559624/3362468
angular.module('editorial')
.filter('escape', [function () {
  return window.encodeURIComponent;
}]);
