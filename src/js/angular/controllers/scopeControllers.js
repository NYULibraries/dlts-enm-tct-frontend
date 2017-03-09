angular.module('editorial')
.controller('ScopeListCtrl', ['$scope', 'Scope', function ($scope, Scope) {
  $scope.scopes = Scope.withCounts(); 
}]);


angular.module('editorial')
.controller('SingleScopeCtrl', ['$scope', 'Scope', 'Deletion', function ($scope, Scope, Deletion) {

  $scope.removeScope = function () {
    Deletion.removeItem({
      title: "Delete Scope?",
      body: "Are you sure you want to remove the scope \"" + $scope.scope.scope + '"?',
      actionName: "Delete",
      item: $scope.scope,
      list: $scope.scopes,
      deletionFunction: Scope.destroy
    });
  };

  $scope.editScopeForm = { show: false };

  $scope.triggerEditScope = function () {
    $scope.tempScope = {
      scope: $scope.scope.scope,
      id: $scope.scope.id
    };
    $scope.errors = {};
    $scope.editScopeForm.show = true;
  };

  $scope.editScope = function () {
    if( $scope.tempScope.scope ) {
      var editSuccess = function (response) {
        response.count = $scope.scope.count;
        $scope.scope.scope = response.scope;
        $scope.editScopeForm.show = false;
      };

      var editFailure = function (response) {
        $scope.errors = response.data;
      };

      Scope.update($scope.tempScope, editSuccess, editFailure);

    } else {
      $scope.errors.scope = "Please Enter a Scope Name";
    }
  };
}]);


angular.module('editorial')
.controller('NewScopeCtrl', ['$scope', 'Scope', function ($scope, Scope) {
  $scope.showNewScopeForm = { show: false };

  $scope.triggerAddScopeForm = function () {
    $scope.newScope = { scope: "" };
    $scope.errors = {};
    $scope.showNewScopeForm.show = true;
  };

  $scope.addNewScope = function () {
    if( $scope.newScope.scope) {
      var addSuccess = function (response) {
        response.count = 0;
        $scope.scopes.push(response);
        $scope.showNewScopeForm.show = false;
      };

      var addFailure = function (response) {
        $scope.errors = response.data;
      };

      Scope.new($scope.newScope.scope, addSuccess, addFailure);

    } else {
      $scope.errors.scope = "Please Enter a Scope Name";
    }
  };
}]);
