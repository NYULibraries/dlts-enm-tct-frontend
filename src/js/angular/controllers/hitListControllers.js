angular.module('editorial')
.controller('HitListCtrl', ['$scope', 'Hit', function ($scope, Hit) {
  $scope.loading = true;

  function hitSuccess (response) {
    $scope.hits = response.map(function (hit) {
      hit.display_name =  Hit.displayName(hit.name, hit.scope, hit.preferred);
      return hit;
    });
    Hit.storeList(response);
    $scope.loading = false;
  }

  function hitFailure (response) {
    $scope.loading = false;
    console.log(response.data);
  }

  $scope.hitCall(hitSuccess, hitFailure);
}]);


angular.module('editorial')
.controller('HitByLetterCtrl', ['$scope', 'Review', '$routeParams', function ($scope, Review, $routeParams) {
  $scope.hitCall = function (success, failure) {
    Review.hitLetterList($routeParams.letter, success, failure);
  };
}]);


angular.module('editorial')
.controller('HitSearchCtrl', ['$scope', 'Review', '$routeParams', function ($scope, Review, $routeParams) {
    $scope.hitCall = function (success, failure) {
      Review.hitSearch($routeParams.term, success, failure);
    };
}]);


angular.module('editorial')
.controller('HitsByTypeCtrl', ['$scope', 'Review', '$routeParams', 
    function ($scope, Review, $routeParams) {
  $scope.hitCall = function (success, failure) {
    Review.hitByType($routeParams.ttype, success);
  };
}]);


angular.module('editorial')
.controller('AllHitsCtrl', ['$scope', 'Review', function ($scope, Review) {
  $scope.hitCall = Review.hitAll;
}]);


angular.module('editorial')
.controller('BypassedHitsCtrl', ['$scope', 'Hit', function ($scope, Hit) {
  $scope.hits = Hit.bypassed();

  $scope.displayName = Hit.displayName;
}]);


angular.module('editorial')
.controller('HitSearchFormCtrl', ['$scope', '$location', function($scope, $location) {

  $scope.search_hits = function () {
    $location.path('/hit/list/search/' + $scope.search_term);
    $scope.search_term = "";
  };
}]);


angular.module('editorial')
.controller('HitsByScopeCtrl', ['$scope', 'Hit', '$routeParams', function ($scope, Hit, $routeParams) {
  $scope.hitCall = function (success, failure) {
    Hit.byScope($routeParams.scope, success, failure);
  };
}]);
