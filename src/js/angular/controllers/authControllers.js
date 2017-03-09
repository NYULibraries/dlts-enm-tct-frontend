'use strict';

angular.module('editorial')
  .controller('LoginCtrl', ['$scope', '$location', 'djangoAuth', 'Validate', function ($scope, $location, djangoAuth, Validate) {
    $scope.user = {username: '', password: ''};
  	$scope.complete = false;
    $scope.login = function(formData) {
      $scope.errors = [];
      Validate.form_validation(formData, $scope.errors);
      if (!formData.$invalid) {
        djangoAuth.login($scope.user.username, $scope.user.password)
        .then(function(data) {
        	// success case
        	$location.path("/");
        },function(data){
        	// error case
        	$scope.errors = data;
        });
      }
    };
  }]);

  angular.module('editorial')
  .controller('LogoutCtrl', ['$scope', '$location', 'djangoAuth', function ($scope, $location, djangoAuth) {
    $scope.logout = function () {
      djangoAuth.logout();
    };
  }]);
