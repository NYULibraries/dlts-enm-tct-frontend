angular.module('editorial')
.controller('LocationDetailCtrl', ['$scope', 'Location', '$routeParams', function ($scope, Location, $routeParams) {
  var getSuccess = function (response) {
    response = response[0];

    response.occurrences.sort(function (a,b) {
      if (a.basket.display_name < b.basket.display_name)
        return -1;
      else if (a.basket.display_name > b.basket.display_name)
        return 1;
      else
        return 0;
    });

    $scope.location = response;
  };

  Location.get($routeParams.locationID, getSuccess);
}]);


angular.module('editorial')
.controller('LocationDetailAllCtrl', ['$scope', 'Location', '$routeParams', '$location', '$anchorScroll', '$timeout',
    function ($scope, Location, $routeParams, $location, $anchorScroll, $timeout) {
  var locationSuccess = function (response) {
    $scope.locations = response;
    $scope.setActive(+$routeParams.locationID);
    $scope.loading = false;

    $timeout(function () {
      $anchorScroll('location-' + $routeParams.locationID);
    });
  };

  var locationFailure = function (response) {
    console.log(response.data);
  };

  $scope.loading = true;

  Location.allFromDocument($routeParams.locationID, locationSuccess, locationFailure);

  $scope.setActive = function (id) {
    $scope.active = id;
  };

  $scope.test = function () {
    $anchorScroll('location-' + $routeParams.locationID);
  };
}]);
