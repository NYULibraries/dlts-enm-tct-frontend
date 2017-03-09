angular.module('editorial')
.controller('HitDetailCtrl', ['$scope', 'Hit', 'Deletion', 'Utils', '$location', 
    function ($scope, Hit, Deletion, Utils, $location) {
  $scope.hitTemplate = "templates/includes/hitDisplay.html";
  $scope.tempHit = $.extend({},$scope.hit);
  $scope.errors = { };

  $scope.clearErrors = function () {
    $scope.errors = {};
  };

  $scope.editHit = function () {
    $scope.tempHit = $.extend({}, $scope.hit);

    if ($scope.tempHit.preferred) {
      $scope.tempHit.display = 'preferred';
    } else {
      if ($scope.tempHit.hidden) {
        $scope.tempHit.display = 'hidden';
      } else {
        $scope.tempHit.display = 'normal';
      }
    }

    $scope.displayOptions = ['preferred', 'hidden', 'normal'];

    $scope.hitTemplate = "templates/includes/hitForm.html";
  };

  $scope.displayHit = function ($event) {
    $event.stopPropagation();
    $scope.hitTemplate = "templates/includes/hitDisplay.html";
  };

  $scope.hitChangeSuccess = function (response) {
    $scope.hitTemplate = "templates/includes/hitDisplay.html";

    var markedPreferred = response.preferred && (!$scope.tempHit.preferred || !$scope.hit.preferred);

    // Double assignment ensure proper scope
    for (var i=0; i < $scope.basket.basket.topic_hits.length; i++) {
      // Set all other names to not preferred if the current hit was marked as preferred
      if (markedPreferred) {
        $scope.basket.basket.topic_hits[i].preferred = false;
      }
      if ($scope.basket.basket.topic_hits[i].id === $scope.hit.id) {
        $scope.basket.basket.topic_hits[i]  = $.extend({}, response);
        $scope.hit = $scope.basket.basket.topic_hits[i];
      }
    }
  };
  $scope.hitChangeFailure = function (response) {
    $scope.errors = response.data;
    console.log(response.data);
  };

  var bypassHitSuccess = function () {
    $scope.hitTemplate = "templates/includes/hitDisplay.html";
    Utils.removeFromList($scope.hit, $scope.basket.basket.topic_hits);

    if ($scope.basket.basket.topic_hits.length === 0) {
      $location.path('/hit/list/bypassed');
    }
  };

  $scope.deleteHit = function () {
    Deletion.removeItem({
      title: "Delete topic name?",
      body: 'Are you sure you want to delete the topic name "' + $scope.hit.name + '"?',
      actionName: "Delete",
      item: $scope.hit,
      list: $scope.basket.basket.topic_hits,
      deletionFunction: Hit.deletehit
    });
  };

  $scope.bypassHit = function () {
    Deletion.removeItem({
      title: "Bypass Topic Name?",
      body: 'Are you sure you want to bypass the topic name "' + $scope.hit.name + '"? This will prevent automatic processing of this topic name in the future.  It will also delete the current topic IF this name is the only name on the topic.',
      actionName: "Bypass",
      item: $scope.hit,
      list: $scope.basket.basket.topic_hits,
      deletionFunction: function (hitID, success, failure) {
        Hit.set_bypass(hitID, true, bypassHitSuccess, failure);
      }
    });
  };

}]);
