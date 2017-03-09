angular.module('editorial')
.controller('ChangeReviewCtrl', ['$scope', 'Review', function ($scope, Review) {
  // Function generator for handling generic Review objects requests
  var generateReviewFunction = function (mark_reviewed, mark_changed) {
    return function (elem, basketID) {
      var failure = function (response) {
        console.log(response);
      };

      var success = function (response) {
        angular.forEach(response, function (value, key) {
          elem[key] = response[key]
        });
      };

      Review.set(basketID, mark_reviewed, mark_changed, success, failure);
    }
  };

  $scope.markReviewed = generateReviewFunction(true, false);
  $scope.markChanged = generateReviewFunction(true, true);
  $scope.markNotReviewed = generateReviewFunction(false, false);
}]);


angular.module('editorial')
.controller('DetailReviewCtrl', ['$scope', 'Review', '$routeParams', function ($scope, Review, $routeParams) {
  $scope.review = { reviewed: false, changed: false };
  $scope.review = Review.get($routeParams.basketID);
}]);
