angular.module('editorial')
.factory('Reconciliation', ['$http', 'Settings', function ($http, Settings) {
  return {
    upload: function (file, success, failure) {
      var fd = new FormData();

      fd.append("file", file);

      $http({
        url: Settings.baseUrl + 'api/reconciliation/upload/',
        method: 'POST',
        data: fd,
        headers: { 'Content-Type': undefined }
      }).then(success, failure);
    }
  };
}]);
