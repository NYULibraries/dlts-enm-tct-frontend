angular.module('editorial')
.controller('IndexFromLocationCtrl', ['$scope', 'Index', '$routeParams', 'Settings',
    function ($scope, Index, $routeParams, Settings) {
  var indexSuccess = function (response) {
    $scope.indexes = response.map(function (index) {
      return {url: Settings.baseUrl.substring(0, Settings.baseUrl.length - 1) + index.url};
    });
  };

  var indexFailure = function (response) {
    console.log(response);
  };
  
  Index.fromLocation($routeParams.locationID, indexSuccess, indexFailure);
}]);
