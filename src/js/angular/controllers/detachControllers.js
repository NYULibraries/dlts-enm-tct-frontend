angular.module('editorial')
.controller('DetachFormCtrl', ['$scope', 'Basket', function ($scope, Basket) {
  $scope.split_data = {
    occurrences: {},
    relations: {},
    types: {}
  };

  // set initial form values: occurrences
  for (var i=0; i < $scope.basket.basket.occurs.length; i++) {
    $scope.split_data.occurrences[$scope.basket.basket.occurs[i].id] = "stay";
  }

  // set initial form values: relations
  for (i=0; i < $scope.basket.relations.length; i++) {
    $scope.split_data.relations[$scope.basket.relations[i].id] = "stay";
  }

  // set initial form values: types
  for (i=0; i < $scope.ttypes.length; i++) {
    $scope.split_data.types[$scope.ttypes[i].id] = "stay";
  }

  var detachFailure = function (response) {
    $scope.processing.active = false;
    console.log(response.data);
  };


  $scope.sendDetach = function () {
    $scope.processing.active = true;
    Basket.detach($scope.basket.basket.id, $scope.hit_to_detach.id, $scope.split_data, $scope.detachSuccess, detachFailure);
  };

}]);

