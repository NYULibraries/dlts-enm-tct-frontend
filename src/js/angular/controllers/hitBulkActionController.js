angular.module('editorial')
.controller('HitBulkActionCtrl', ['$scope', 'Hit', 'Utils', 'Basket', '$location', 'Merge',
    function ($scope, Hit, Utils, Basket, $location, Merge) {
  $scope.bulkData = { hits: {} };
  $scope.bulkError = "";

  var getBulkData = function () {
    // Extract the selected Hit IDs
    var selectedHits = [];
    for (var key in $scope.bulkData.hits) {
      if ($scope.bulkData.hits.hasOwnProperty(key)) {
        if ($scope.bulkData.hits[key]) {
          selectedHits.push(key);
        }
      }
    }
    if (selectedHits.length === 0) {
      $scope.bulkError = "Please select some topic names";
    } else {
      return selectedHits;
    }
  };

  var failure = function (response) {
    console.log(response);
  };

  $scope.bulkMerge = function () {
    $scope.bulkError = "";
    var selected = getBulkData();

    if (selected) {
      var mergeSuccess = function (response) {
        $location.path('/basket/' + response.basket);
      };

      Merge.byHits(selected, mergeSuccess, failure);
    }
  };

  $scope.bulkBypass = function () {
    $scope.bulkError = "";
    var selected = getBulkData();

    if (selected) {
      var bypassSuccess = function () {
        $scope.bulkData = { hits: {} };
        for (var i=0; i < selected.length; i++) {
          Utils.removeFromList({id: +selected[i]}, $scope.hits);
        }
      };

      Hit.bulkBypass(selected, bypassSuccess, failure);
    }
  };

}]);


angular.module('editorial')
.controller('HitBypassBulkCtrl', ['$scope', 'Hit', 'Utils',
    function ($scope, Hit, Utils) {
  $scope.bulkData = { hits: {} };
  $scope.bulkError = "";

  var getBulkData = function () {
    // Extract the selected Hit IDs
    var selectedHits = [];
    for (var key in $scope.bulkData.hits) {
      if ($scope.bulkData.hits.hasOwnProperty(key)) {
        if ($scope.bulkData.hits[key]) {
          selectedHits.push(key);
        }
      }
    }
    if (selectedHits.length === 0) {
      $scope.bulkError = "Please select some topic names";
    } else {
      return selectedHits;
    }
  };

  var failure = function (response) {
    console.log(response);
  };

  $scope.bulkUnbypass = function () {
    $scope.bulkError = "";
    var selected = getBulkData();

    if (selected) {
      var bypassSuccess = function () {
        $scope.bulkData = { hits: {} };
        for (var i=0; i < selected.length; i++) {
          Utils.removeFromList({id: +selected[i]}, $scope.hits);
        }
      };

      Hit.bulkUnbypass(selected, bypassSuccess, failure);
    }
  };
}]);
