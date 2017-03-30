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

editorial.config(['$resourceProvider', '$locationProvider', '$httpProvider',
    function($resourceProvider, $locationProvider, $httpProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('tokenCleaner');
}]);

