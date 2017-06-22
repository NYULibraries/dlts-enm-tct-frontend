angular.module('editorial')
.controller('RelationListCtrl', ['$scope', 'Relation', '$routeParams', function ($scope, Relation, $routeParams) {
  $scope.loading = true;
  var relationType = $routeParams.relationType.replace('+', '/');
  $scope.relationType = relationType;

  function relationSuccess (response) {
    $scope.relations = response.map(function (relation) {
      var rtype = relation.relationtype.rtype === 'Generic' ? 'is related to' : relation.relationtype.role_to;
      relation.display_name = relation.destination.display_name + ' ' + rtype + ' ' + relation.source.display_name;
      return relation;
    });
    $scope.loading = false;
  }

  function relationFailure (response) {
    $scope.loading = false;
    console.log(response.data);
  }

  Relation.list(relationType, relationSuccess, relationFailure);
}]);
