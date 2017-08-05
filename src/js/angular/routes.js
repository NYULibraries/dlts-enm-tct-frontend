angular.module('editorial')
.config(['$routeProvider', 'Settings', function ($routeProvider, Settings) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/landing.html',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/basket/new',{
      templateUrl: 'templates/basket_new.html',
      controller: 'BasketNewCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/basket/all',{
      templateUrl: 'templates/baskets.html',
      controller: 'BasketAllCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/basket/letter/:letter',{
      templateUrl: 'templates/baskets.html',
      controller: 'BasketByLetterCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/basket/document/:docID',{
      templateUrl: 'templates/baskets.html',
      controller: 'BasketByDocumentCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/basket/:basketID',{
      templateUrl: 'templates/basket_detail.html',
      controller: 'BasketDetailCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/hit/list/search/:term', {
      templateUrl: 'templates/hits.html',
      controller: 'HitSearchCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/hit/list/letter/:letter', {
      templateUrl: 'templates/hits.html',
      controller: 'HitByLetterCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/hit/list/all', {
      templateUrl: 'templates/hits.html',
      controller: 'AllHitsCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/hit/list/by-type/:ttype', {
      templateUrl: 'templates/hits.html',
      controller: 'HitsByTypeCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/hit/list/by-scope/:scope', {
      templateUrl: 'templates/hits.html',
      controller: 'HitsByScopeCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/hit/list/bypassed', {
      templateUrl: 'templates/bypassed_hits.html',
      controller: 'BypassedHitsCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/scopes/all', {
      templateUrl: 'templates/scopes.html',
      controller: 'ScopeListCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/reports', {
      templateUrl: 'templates/reports.html',
      controller: 'AllReportsCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/document/all', {
      templateUrl: 'templates/documents.html',
      controller: 'DocumentListCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/document/:documentID/detail', {
      templateUrl: Settings.separatePageLocations ? 'templates/document_detail.html' : 'templates/document_detail_with_occurrences.html',
      controller: Settings.separatePageLocations ? 'DocumentDetailCtrl' : 'DocumentDetailWithOccurrencesCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/location/:locationID', {
      templateUrl: Settings.separatePageLocations ? 'templates/location.html' : 'templates/document_detail_with_occurrences.html',
      controller: Settings.separatePageLocations ? 'LocationDetailCtrl' : 'LocationDetailAllCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/deletion/success', {
      templateUrl: 'templates/success.html',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/types/all', {
      templateUrl: 'templates/types.html',
      controller: 'AllTypesCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/relations/:relationType', {
      templateUrl: 'templates/relations.html',
      controller: 'RelationListCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/relationtypes/all', {
      templateUrl: 'templates/relationtypes.html',
      controller: 'AllRelationTypesCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/reconciliation', {
      templateUrl: 'templates/reconciliation.html',
      controller: 'ReconciliationCtrl',
      resolve: {
        authenticated: ['djangoAuth', function(djangoAuth){
          // MAKE TRUE FOR PRODUCTION
          return djangoAuth.authenticationStatus(true);
        }],
      }
    })
    .when('/login', {
      templateUrl: 'templates/auth/login.html'
    })
    .otherwise({
      redirectTo: '/',
    });
}]);
