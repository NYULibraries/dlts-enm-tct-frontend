angular.module('editorial')
.controller('HitFormCtrl', ['$scope', 'Scope', 'Hit', 
    function ($scope, Scope, Hit) {
  $scope.scopes = Scope.getAll();
  $scope.addOrSelectValue = 'scope';


  $scope.changeHit = function () {
    $scope.clearErrors();

    $scope.tempHit.preferred = $scope.tempHit.display === 'preferred' ? true : false;
    $scope.tempHit.hidden = $scope.tempHit.display === 'hidden' ? true : false;

    Hit.update($scope.hit.id, $scope.tempHit, $scope.hitChangeSuccess, $scope.hitChangeFailure);
  };
}]);
