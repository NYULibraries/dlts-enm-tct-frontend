angular.module('editorial')
.controller('BasketDetailCtrl', ['$scope', '$routeParams', 'Basket', 'Relation', 'Hit', 'Ttype',
  function ($scope, $routeParams, Basket, Relation, Hit, Ttype) {
    var basketSuccess = function (response) {

      $scope.basket = Basket.parseBasketData(response);
    };

    $scope.processing = { active: false };
    Basket.detail($routeParams.basketID, basketSuccess);

    $scope.displayName = Hit.displayName;

    $scope.basket_detail_template = "templates/includes/basket_detail_show.html";
    $scope.destination = {};

    $scope.set_basket = function (basket) {
      $scope.basket = basket;
    };

    $scope.modalTemplate = "templates/includes/modal.html";

    $scope.addHitToNamesList = function (hit) {
      $scope.basket.basket.topic_hits.push(hit);
    };
    
    $scope.detachHit = function (hit) {
        $scope.hit_to_detach = hit;

        $scope.basket_detail_template = "templates/includes/basket_detail_detach_form.html";
    };

    $scope.showDetail = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.basket_detail_template = "templates/includes/basket_detail_show.html";
    };

    $scope.detachSuccess = function (response) {
      $scope.processing.active = true;
      $scope.basket = response;
      $scope.ttypes = Ttype.listByBasket($routeParams.basketID); 

      $scope.basket_detail_template = "templates/includes/basket_detail_show.html";
    };


}]);


angular.module('editorial')
.controller('DeleteBasketCtrl', ['$scope', 'Deletion', 'Basket', '$location', function ($scope, Deletion, Basket, $location) {
  var basketSuccess = function () {
    $location.path('/deletion/success');
  };

  $scope.deleteBasket = function () {
    Deletion.removeItem({
      title: "Delete This Topic?",
      body: 'Are you sure you want to delete the topic "' + Basket.findPreferredName($scope.basket.basket) + '"?  This will delete all associated occurrences, names, and relations.  This cannot be undone.',
      actionName: "Delete",
      item: $scope.basket.basket,
      success: basketSuccess,
      deletionFunction: Basket.remove
    });
  };
}]);


angular.module('editorial')
.controller('BasketNewCtrl', ['$scope', 'Basket', '$location', 
    function ($scope, Basket, $location) {
  $scope.error = "";

  $scope.addTopic = function () {
    var success = function (response) {
      $scope.newHit.name = "";
      $('#new-topic-form').collapse('hide');
      $location.path('/basket/' + response.id);
    };

    var failure = function (response) {
      $scope.error = response.data.error;
    };

    if ($scope.newHit.name) {
      Basket.add($scope.newHit.name, success, failure);
    } else {
      $scope.error = "Please enter a name for the new topic";
    }

  };
}]);

angular.module('editorial')
.controller('BasketDescriptionCtrl', ['$scope', 'Basket', function ($scope, Basket) {
  $scope.descriptionForm = { show: false };

  $scope.triggerDescriptionForm = function () {
    $scope.tempDescription = $scope.basket.basket.description;
    $scope.descriptionForm.show = true;
  };

  $scope.updateDescription = function () {
    var basket = {
      id: $scope.basket.basket.id,
      display_name: $scope.basket.basket.display_name,
      description: $scope.tempDescription
    };

    var success = function (response) {
      $scope.basket.basket.description = response.description;
      $scope.descriptionForm.show = false;
    };

    var failure = function (response) {
      console.log(response.data);
    };

    Basket.update($scope.basket.basket.id, basket, success, failure);
  };
}]);
