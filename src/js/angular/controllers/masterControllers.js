angular.module('editorial')
.controller('MasterCtrl', ['$scope', '$http', 'djangoAuth', '$location', 
    function ($scope, $http, djangoAuth, $location) {
  // Assume user is not logged in until we hear otherwise
  $scope.authenticated = false;
  $scope.user = {username: '', password: ''};

  // Wait for the status of authentication, set scope var to true if it resolves
  djangoAuth.authenticationStatus(true).then(function(){
      $scope.authenticated = true;
      djangoAuth.profile().then(function(data){
          $scope.user = data;
      });
  });

  // Wait and respond to the logout event.
  $scope.$on('djangoAuth.logged_out', function() {
    $scope.user = {username: '', password: ''};
    $location.path('/login');
    $scope.authenticated = false;
  });

  // Wait and respond to the log in event.
  $scope.$on('djangoAuth.logged_in', function(data) {
    $scope.authenticated = true;
    djangoAuth.profile().then(function (data) {
      $scope.user = data;
    });
  });

  // If the user attempts to access a restricted page, redirect them back to the main page.
  $scope.$on('$routeChangeError', function(ev, current, previous, rejection){
    console.error("Unable to change routes.  Error: ", rejection);
    $location.path('/login').replace();
  });
}]);
