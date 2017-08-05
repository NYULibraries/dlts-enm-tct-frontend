angular.module('editorial')
.controller('BasketTypesCtrl', ['$scope', 'Ttype', 'Basket', 'Utils', '$routeParams', function ($scope, Ttype, Basket, Utils, $routeParams) {
  $scope.showTypesForm = { show: false};
  $scope.addOrSelectValue = 'ttype';
  $scope.formData = {};
  $scope.allTypes = Ttype.all();

  $scope.triggerAddType = function () {
    $scope.formData = {};
    $scope.showTypesForm.show = true;
  };


  $scope.addType = function () {
    var success = function (response) {
      if ($scope.basket.basket.types) {
        $scope.basket.basket.types.push(response);
      } else {
        $scope.basket.basket.types = [response];
      }
      $scope.showTypesForm.show = false;
    };

    Basket.addType($scope.basket.basket.id, $scope.formData.newType, success);
  };


}]);

angular.module('editorial')
.controller('SingleTtypeCtrl', ['$scope', 'Ttype', 'Deletion', function ($scope, Ttype, Deletion) {

  $scope.removeTtype = function () {
    Deletion.removeItem({
      title: "Remove Topic Type?",
      body: "Are you sure you want to remove the topic type \"" + $scope.type.ttype + '"?',
      actionName: "Remove",
      item: $scope.type,
      list: $scope.basket.basket.types,
      deletionFunction: function (item_id, success, failure) {
        Ttype.discard(item_id, $scope.basket.basket.id, success, failure);
      }
    });
  };
}]);

angular.module('editorial')
.controller('SingleTtypeSoloCtrl', ['$scope', 'Ttype', 'Deletion', function ($scope, Ttype, Deletion) {
  $scope.editTypeForm = { show: false };
  $scope.errors = {};

  $scope.removeTtype = function () {
    var body = "Are you sure you want to delete the topic type \"" + $scope.ttype.ttype + '"?';

    if ($scope.ttype.count > 0) {
      body += ' It will be permanently removed from the ' + $scope.ttype.count + ' topics it is currently on.';
    }

    Deletion.removeItem({
      title: "Delete Topic Type?",
      body: body,
      actionName: "Delete",
      item: $scope.ttype,
      list: $scope.basket.basket.types,
      deletionFunction: Ttype.destroy
    });
  };

  function editTypeSuccess (response) {
    $scope.ttype.ttype = response.ttype;
    $scope.editTypeForm.show = false;
  }

  function editTypeFailure (response) {
    console.log(response.data);
  }

  $scope.triggerEditType = function () {
    $scope.errors = {};

    $scope.editTypeForm.show = true;
    $scope.tempType = $.extend({}, $scope.ttype);
  };

  $scope.editTtype = function () {
    $scope.errors = {};

    if (!$scope.tempType.ttype) {
      $scope.errors.ttype = "Please enter a name for the Topic Type";
    } else {
      Ttype.update($scope.tempType, editTypeSuccess, editTypeFailure);
    }
  };
}]);

angular.module('editorial')
.controller('NewTtypeCtrl', ['$scope', 'Ttype', function ($scope, Ttype) {
  $scope.showNewTypeForm = { show: false };

  function newTypeSuccess (response) {
    $scope.showNewTypeForm.show = false;
    response.count = 0;

    $scope.basket.basket.types.push(response);
  }

  function newTypeFailure (response) {
    console.log(response.data);
  }

  $scope.triggerAddTypeForm = function () {
    $scope.showNewTypeForm.show = true;
    $scope.newType = { ttype: "" };
    $scope.errors = {};
  };

  $scope.addNewType = function () {
    $scope.errors = {};

    if (!$scope.newType.ttype) {
      $scope.errors.ttype = "Please enter a name for the Topic Type";
    } else {
      Ttype.create($scope.newType, newTypeSuccess, newTypeFailure);
    }
  };
}]);

angular.module('editorial')
.controller('AllTypesCtrl', ['$scope', 'Ttype', function ($scope, Ttype) {
  $scope.ttypes = Ttype.allWithCounts();
}]);
