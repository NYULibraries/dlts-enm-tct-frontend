angular.module('editorial')
.controller('AddOrSelectCtrl', ['$scope', function ($scope) {
  $scope.selected = {};

  $scope.refreshResults = function ($select){
    var search = $select.search,
      list = angular.copy($select.items),
      FLAG = -1;
    //remove last user input
    list = list.filter(function(item) {
      return item.id !== FLAG;
    });

    if (!search) {
      //use the predefined list
      $select.items = list;
    }
    else {
      //manually add user input and set selection
      var userInputItem = {
        id: FLAG,
      };
      userInputItem[$scope.addOrSelectValue] = search;
      $select.items = [userInputItem].concat(list);
      $select.selected = userInputItem;
    }
  };

  $scope.clear = function ($event, $select){
    $event.stopPropagation();
    //to allow empty field, in order to force a selection remove the following line
    $select.selected = undefined;
    //reset search query
    $select.search = undefined;
    //focus and open dropdown
    $select.activate();
  };
}]);
