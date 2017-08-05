angular.module('editorial')
.controller('GlobalAutomaticCtrl', ['$scope', 'Automatic', function ($scope, Automatic) {
  $scope.processing = false;

  $scope.runAutomaticRules = function () {
    $scope.process = true;

    var success = function (response) {
      $scope.processing = false;
    };

    var failure = function (response) {
      console.log(response.data);
      $scope.process = false;
    };

    Automatic.all(success, failure);
  };
}]);
