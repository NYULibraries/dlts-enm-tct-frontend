angular.module('editorial')
.controller('MergeBasketCtrl', ['$scope', 'Merge', '$route', 'BaseUrl', 'ModalService',
    function ($scope, Merge, $route, BaseUrl, ModalService) {
  $scope.showMergeForm = { show: false };
  $scope.merging = false;
  $scope.hitToMerge = {};

  var mergeSuccess = function () {
    $route.reload(); 
  };

  var mergeFailure = function (response) {
    console.log(response.data);
    $scope.merging = false;
    $scope.error = "Merge Failed!";
  };

  $scope.showMergeTemplate = function () {
    $scope.hitListUrl = BaseUrl + 'api/hit/hits/search/?exclude_basket=' + $scope.basket.basket.id +
      '&as_object=True&name=';
    $scope.showMergeForm.show = true;
    $scope.$broadcast('angucomplete-alt:clearInput', 'merge_angucomplete');
  };

  $scope.mergeTopics = function () {
    $scope.error = "";
    if ($scope.hitToMerge && $scope.hitToMerge.originalObject && $scope.hitToMerge.originalObject.basket) {
      console.log($scope.hitToMerge);

      ModalService.showModal({
        templateUrl: 'templates/includes/modal.html',
        controller: 'DeleteModalCtrl',
        inputs: {
          title: 'Merge Topics?',
          body: 'Do you want to merge topics with "' + $scope.hitToMerge.title + '"? This action cannot be undone.',
          actionName: 'Merge'
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (confirmation) {
          if (confirmation) {
            $scope.merging = true;
            Merge.merge($scope.hitToMerge.originalObject.basket, $scope.basket.basket.id, mergeSuccess);
          } else {
            $scope.showMergeForm.show = false;
          }
        });
      });
            
    } else {
      $scope.error = "Please Select a Topic";
    }
  };
}]);
