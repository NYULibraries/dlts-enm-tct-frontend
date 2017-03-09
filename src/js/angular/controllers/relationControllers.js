angular.module('editorial')
.controller('AllRelationsCtrl', ['$scope', 'Relation', 'Basket', '$routeParams', 'Deletion', 'Utils',
    function ($scope, Relation, Basket, $routeParams, Deletion, Utils) {
  $scope.rtypes = Relation.allTypes();
  $scope.relationForm = 'templates/includes/addRelatedBasket.html';
  $scope.hitListUrl = Basket.hitListUrl($routeParams.basketID);
  $scope.bulkRelations = {};
  $scope.selectAll = true;

  $scope.bulkRelationDelete = function () {
    var relations_to_delete = [];

    for (var id in $scope.bulkRelations) {
      if($scope.bulkRelations.hasOwnProperty(id) && $scope.bulkRelations[id]) {
        relations_to_delete.push(Utils.arraySearch($scope.basket.relations, parseInt(id)));
      }
    }

    if (relations_to_delete.length > 0) {
      var relation_ids = relations_to_delete.map(function (relation) { return relation.id; });

      Deletion.removeItem({
        body: relations_to_delete,
        title: "Remove Relations?",
        templateUrl: 'templates/includes/bulkDeleteRelationModal.html',
        deletionFunction: function (item_id, success, failure) {
          Relation.bulkDelete(relation_ids, success, failure);
        }, 
        success: function () {
          Utils.bulkRemove(relations_to_delete, $scope.basket.relations);
          $scope.bulkRelations = {};
        },
      });
    }
  };

  $scope.bulkToggle = function () {
    for (var i = 0; i < $scope.basket.relations.length; i++) {
      $scope.bulkRelations[$scope.basket.relations[i].id] = $scope.selectAll ? true : false;
    };

    $scope.selectAll = !$scope.selectAll;
  };
}]);


angular.module('editorial')
.controller('RelationFormCtrl', ['$scope', 'Relation', function ($scope, Relation) {
  $scope.showNewRtypeForm = { show: false };

  $scope.addNewRtype = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.showNewRtypeForm.show = true;

    $scope.newRtype = {
      rtype: "",
      description: "",
      symmetrical: true,
      role_to: "",
      role_from: ""
    };
  };

  $scope.submitRtype = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    if ($scope.newRtype.symmetrical) {
      $scope.newRtype.role_from = $scope.newRtype.role_to;
      $scope.newRtype.rtype = $scope.newRtype.role_to;
    } else {
      $scope.newRtype.rtype = $scope.newRtype.role_to + '/' +  $scope.newRtype.role_from;
    }

    var addRtypeSuccess = function (response) {
      response.type_name = response.direction === 'source' ? response.role_to : response.role_from;
      $scope.rtypes.push(response);
      $scope.showNewRtypeForm.show = false;
      $scope.newRelation.relationtype = response;
    };

    var addRtypeFailure = function (response) {
      console.log(response.data);
    };

    Relation.newType($scope.newRtype, addRtypeSuccess, addRtypeFailure);
  };

}]);


angular.module('editorial')
.controller('NewRelatedBasketCtrl', ['$scope', 'Relation', function ($scope, Relation) {
  $scope.showRelationForm = { show: false };

  $scope.submitRelationForm = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    var createRelationSuccess = function (response) {
      response.type_name = response.direction === 'destination' ? response.relationtype.role_from : response.relationtype.role_to;
      $scope.basket.relations.push(response);

      $scope.showRelationForm.show = false;
    };

    var relationData = {
      relationtype: $scope.newRelation.relationtype.id,
      source: $scope.newRelation.direction === 'destination' ? $scope.basket.basket.id : $scope.newRelation.temp_basket.originalObject.basket,
      direction: $scope.newRelation.direction
    };

    relationData.destination = relationData.source === $scope.basket.basket.id ? $scope.newRelation.temp_basket.originalObject.basket : $scope.basket.basket.id;

    Relation.create(relationData, createRelationSuccess);

  };

  $scope.triggerRelationForm = function () {

    $scope.showRelationForm.show = true;
    $scope.$broadcast('angucomplete-alt:clearInput', 'ex1');

    var generic = $scope.rtypes.filter(function (t) { return t.rtype === 'Generic';})[0];

    $scope.newRelation = {
      relationtype: generic,
      direction: 'source'
    };
  };
}]);

angular.module('editorial')
.controller('SingleRelationCtrl', ['$scope', 'Relation', 'Deletion', function ($scope, Relation, Deletion) {

  $scope.removeRelation = function () {
    Deletion.removeItem({
      title: "Remove relation?",
      body: "Are you sure you want to remove the relation to " + $scope.relation.basket.preferred_name + "?",
      actionName: "Remove",
      item: $scope.relation,
      list: $scope.basket.relations,
      deletionFunction: Relation.removeRelation
    });
  };

  $scope.showRelationForm = { show: false };

  $scope.triggerEditRelationForm = function () {
    $scope.showRelationForm.show = true;
    $scope.newRelation = $.extend($scope.relation);
    $scope.currentBasket = { name: $scope.relation.basket.display_name, basket: $scope.relation.basket.id };
  };

  $scope.submitRelationForm = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    function editRelationSuccess (response) {
      $scope.showRelationForm.show = false;
      response.type_name = response.direction === 'destination' ? response.relationtype.role_from : response.relationtype.role_to;
      $scope.relation = $.extend({}, response);
    }

    function editRelationFailure (response) {
      console.log(response.data);
    }

    var target_basket = $scope.newRelation.temp_basket.originalObject ? $scope.newRelation.temp_basket.originalObject.basket : $scope.relation.basket.id;

    var relationData = {
      relationtype: $scope.newRelation.relationtype.id,
      source: $scope.newRelation.direction === 'destination' ? $scope.basket.basket.id : target_basket,
      direction: $scope.newRelation.direction,
      id: $scope.relation.id
    };

    relationData.destination = relationData.source === $scope.basket.basket.id ? target_basket : $scope.basket.basket.id;

    Relation.edit(relationData, editRelationSuccess, editRelationFailure);

  };

}]);
