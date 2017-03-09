angular.module('editorial')
.controller('DeleteModalCtrl', [
    '$scope', '$element', 'title', 'body', 'actionName', 'close',
    function ($scope, $element, title, body, actionName,  close) {

       $scope.title = title;
       $scope.body = body;
       $scope.actionName = actionName;
       
       $scope.close = function (result) {
        close(result, 500);
       };
}]);
