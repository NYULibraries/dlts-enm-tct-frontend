angular.module('editorial')
.controller('MoveOccurrenceModalCtrl', [
    '$scope', '$element', 'close', 'title', 'body', 'actionName', 'Basket',
    function ($scope, $element, close, title, body, actionName, Basket) {
      $scope.occurrence_name = body;
      $scope.nextBasket = {};
      var current_basket_id = title;
      $scope.hitListUrl = Basket.hitListUrl(current_basket_id);

      $scope.close = function (result) {
        // Get the actual basket_id out of the autocomplete
        //
        if (result) {
          result = result.originalObject.basket;
        }

        close(result, 500);
      };
}]);
