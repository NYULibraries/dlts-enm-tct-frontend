angular.module('editorial')
.controller('AllRelationTypesCtrl', ['$scope', 'Relation', '$location', function ($scope, Relation, $location) {
  $scope.relationtypes = Relation.typesWithCounts();

  $scope.escape = function (rtype) {
    return '/relations/' + window.encodeURIComponent(rtype.replace('/', '+'));
  };
}]);


angular.module('editorial')
.controller('SingleRelationTypeCtrl', ['$scope', 'Relation', 'Deletion', function ($scope, Relation, Deletion) {
  $scope.removeRtype = function () {
    Deletion.removeItem({
      title: "Delete Relation Type?",
      body: "Are you sure you want to remove the topic type \"" + $scope.rtype.rtype + '"? All Relations with this type will be set to "Generic".',
      actionName: "Delete",
      item: $scope.rtype,
      list: $scope.relationtypes,
      deletionFunction: Relation.destroyType
    });
  };

  $scope.showEditTypeForm = { show: false };
  $scope.triggerEditRtype = function () {
    $scope.showEditTypeForm.show = true;
    $scope.newRtype = $.extend({}, $scope.rtype);
  };

  $scope.editRtype = function () {

    if ($scope.newRtype.symmetrical) {
      $scope.newRtype.role_from = $scope.newRtype.role_to;
      $scope.newRtype.rtype = $scope.newRtype.role_to;
    } else {
      $scope.newRtype.rtype = $scope.newRtype.role_to + '/' +  $scope.newRtype.role_from;
    }

    var editRtypeSuccess = function (response) {
      response.count = $scope.newRtype.count;
      $scope.rtype = $.extend({}, response);
      $scope.showEditTypeForm.show = false;
    };

    var editRtypeFailure = function (response) {
      console.log(response.data);
    };

    Relation.updateType($scope.newRtype, editRtypeSuccess, editRtypeFailure);
  };
}]);


angular.module('editorial')
.controller('NewRtypeCtrl', ['$scope', 'Relation', function ($scope, Relation) {
  $scope.showNewTypeForm = { show: false };

  $scope.triggerAddTypeForm = function () {
    $scope.showNewTypeForm.show = true;
    $scope.newRtype = {
      rtype: "",
      description: "",
      symmetrical: true,
      role_to: "",
      role_from: ""
    };
  };

  $scope.addNewType = function () {

    if ($scope.newRtype.symmetrical) {
      $scope.newRtype.role_from = $scope.newRtype.role_to;
      $scope.newRtype.rtype = $scope.newRtype.role_to;
    } else {
      $scope.newRtype.rtype = $scope.newRtype.role_to + '/' +  $scope.newRtype.role_from;
    }

    var addRtypeSuccess = function (response) {
      response.count = 0;
      $scope.relationtypes.push(response);
      $scope.showNewTypeForm.show = false;
    };

    var addRtypeFailure = function (response) {
      console.log(response.data);
    };

    Relation.newType($scope.newRtype, addRtypeSuccess, addRtypeFailure);
  };
}]);
