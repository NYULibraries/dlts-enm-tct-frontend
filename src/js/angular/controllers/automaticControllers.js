angular.module('editorial')
.controller('AutomaticRelationCtrl', ['$scope', 'Automatic', 'Basket',
    function ($scope, Automatic, Basket) {
  $scope.running = false;

  $scope.runAutomaticRelations = function () {
    $scope.running = true;

    var automaticSuccess = function (response) {
      $scope.running = false; 
      $scope.basket.relations = Basket.parseBasketData(response).relations;
    };

    var automaticFailure = function (response) {
      $scope.running = false;
      console.log(response);
    };

    Automatic.runRules($scope.basket.basket.id, automaticSuccess, automaticFailure);
  };
}]);
