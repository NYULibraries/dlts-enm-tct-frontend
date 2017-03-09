angular.module('editorial')
.controller('BasketNavCtrl', ['$scope', 'Hit', function ($scope, Hit) {
  $scope.nextHit = Hit.nextHit();
  $scope.previousHit = Hit.previousHit();

  $scope.setNextHit = Hit.setNextHit;
  $scope.setPreviousHit = Hit.setPreviousHit;
}]);
