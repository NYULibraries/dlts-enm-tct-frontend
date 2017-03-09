angular.module('editorial')
.controller('IndexFromLocationCtrl', ['$scope', 'Index', '$routeParams', 'BaseUrl',
    function ($scope, Index, $routeParams, BaseUrl) {
  var indexSuccess = function (response) {
    $scope.indexes = response.map(function (index) {
      return {url: BaseUrl.substring(0, BaseUrl.length - 1) + index.url};
    });
  };

  var indexFailure = function (response) {
    console.log(response);
  };
  
  Index.fromLocation($routeParams.locationID, indexSuccess, indexFailure);
}]);
