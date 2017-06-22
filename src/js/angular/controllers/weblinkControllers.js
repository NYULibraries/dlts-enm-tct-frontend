angular.module('editorial')
.controller('AllWeblinksCtrl', ['$scope', 'Weblink', '$routeParams', function ($scope, Weblink, $routeParams) {
    $scope.weblinks = Weblink.listByBasket($routeParams.basketID);
}]);


angular.module('editorial')
.controller('NewWebLinkCtrl', ['$scope', 'Weblink', 'Utils', '$routeParams', function ($scope, Weblink, Utils, $routeParams) {

  $scope.showLinkForm = {show: false};

  $scope.triggerAddLink = function () {
    $scope.newLink = {
      url: "",
      content: ""
    };

    $scope.showLinkForm.show = true;
  };

  $scope.addLink = function () {
    var addLinkSuccess = function (response) {
      $scope.weblinks.push(response);

      $scope.showLinkForm = false;
    };

    Weblink.newLink($scope.basket.basket.id, $scope.newLink, addLinkSuccess);
  };

}]);

angular.module('editorial')
.controller('SingleWeblinkCtrl', ['$scope', 'Weblink', 'Deletion', function ($scope, Weblink, Deletion) {
  $scope.showLinkEditForm = {show: false};

  $scope.triggerEditLinkForm = function () {
    $scope.tempLink = $.extend({}, $scope.weblink);

    $scope.showLinkEditForm.show = true;
  };

  $scope.applyWeblinkEdit = function () {
    var editSuccess = function (response) {
      $scope.weblink = response;
      $scope.showLinkEditForm.show = false;
    };

    var editFailure = function (response) {
      console.log(response);
    };

    Weblink.update($scope.tempLink, editSuccess, editFailure);
  };

  $scope.removeWeblink= function () {
    Deletion.removeItem({
      title: "Remove Weblink?",
      body: "Are you sure you want to remove the weblink \"" + $scope.weblink.content + "\" (" + $scope.weblink.url + ")",
      actionName: "Remove",
      item: $scope.weblink,
      list: $scope.weblinks,
      deletionFunction: function (item_id, success, failure) {
        Weblink.discard(item_id, $scope.basket.basket.id, success, failure);
      }
    });
  };
}]);
