angular.module('editorial')
.controller('BasketListCtrl', ['$scope', 'Hit', 'Utils', function ($scope, Hit, Utils) {
  $scope.loading = true;
  $scope.filter_options = ['Any Topic', 'Unreviewed', 'Reviewed'];
  $scope.filtering = $scope.filter_options[0];
  var unfilteredTopics = [];

  $scope.basketFilter = function (filter) {
    if (filter !== $scope.filtering) {
      switch (filter) {
        case "Unreviewed":
          $scope.baskets = unfilteredTopics.filter(function (basket) { return basket.review.reviewed === false; });
          break;
        case "Reviewed":
          $scope.baskets = unfilteredTopics.filter(function (basket) { return basket.review.reviewed === true; });
          break;
        case "Any Topic":
        default:
          $scope.baskets = unfilteredTopics.slice();
          break;
      }

      Hit.storeList($scope.baskets);
      $scope.filtering = filter;
    }
  };

  $scope.order_options = [ 
    { type: 'alphabetical', descending: false, prop: 'display_name' },
    { type: '# of occurrences', descending: true, prop: 'occurrence_counts' },
    { type: '# of relations', descending: true, prop: 'relation_counts' }
  ];
  $scope.ordering = $scope.order_options[0];

  $scope.basketOrder = function (order) {
    $scope.baskets = Utils.sortListByProperty($scope.baskets, order.prop, order.descending);
    unfilteredTopics = Utils.sortListByProperty(unfilteredTopics, order.prop, order.descending);

    Hit.storeList($scope.baskets);
    $scope.ordering = order;
  };

  function basketSuccess(response) {
    unfilteredTopics = response.map(function (basket) {
      // duplicating id in basket so the topic list can piggyback on the hit list 
      // for inter topic navigation
      basket.basket =  basket.id;
      return basket;
    });
    Hit.storeList(response);
    $scope.baskets = unfilteredTopics.slice();

    $scope.loading = false;
  }

  function basketFailure(response) {
    $scope.loading = false;
    console.log(response.data);
  }

  $scope.basketCall(basketSuccess, basketFailure);
}]);


angular.module('editorial')
.controller('BasketAllCtrl', ['$scope', 'Review', function ($scope, Review) {
  $scope.basketCall = function (success, failure) {
    Review.basketAll(success, failure);
  };
}]);


angular.module('editorial')
.controller('BasketByLetterCtrl', ['$scope', 'Review', '$routeParams', 
    function ($scope, Review, $routeParams) {
  $scope.basketCall = function (success, failure) {
    Review.basketByLetter($routeParams.letter, success, failure);
  };
}]);


angular.module('editorial')
.controller('BasketByDocumentCtrl', ['$scope', 'Review', '$routeParams',
    function ($scope, Review, $routeParams) {
  $scope.basketCall = function (success, failure) {
    Review.basketByDocument($routeParams.docID, success, failure);
  };
}]);
