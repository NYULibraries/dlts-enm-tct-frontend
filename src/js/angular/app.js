'use strict';

var editorial = angular.module('editorial', [
  'ngCookies',
  'ngRoute',
  'ngResource',
  'angucomplete-alt',
  'ui.select',
  'ngSanitize',
  'angularModalService',
  'dndLists'
]);

editorial.config(['$resourceProvider',function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);


// api settings
editorial.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('tokenCleaner');
}]);


