angular.module('editorial')
.controller('ReconciliationCtrl', ['$scope', 'Reconciliation', function ($scope, Reconciliation) {
  $scope.processing = false;
  $scope.successMessage = "";
  $scope.reconciliationErrors = [];

  var success = function (response) {
    $scope.reconciliationErrors = response.data;
    $scope.processing = false;
    $scope.successMessage = "Processing Complete";
  }

  var failure = function (response) {
    $scope.api_errors = response.data ? response.data.non_field_errors : ["Unable to run reconciliation right now. Please try again later"];
    $scope.processing = false;
    console.log(response.data);
  };

  $scope.reconcile = function () {
    $scope.api_errors = [];
    $scope.reconciliationErrors = [];
    $scope.successMessage = "";

    if (!$scope.reconciliationJSON) {
      $scope.api_errors.push("Please select a JSON file");
    } else {
      $scope.processing = true;
      Reconciliation.upload($scope.reconciliationJSON, success, failure);
    }
  };

  $scope.check = function () {
    console.log($scope.reconciliationJSON);
  };
}]);
