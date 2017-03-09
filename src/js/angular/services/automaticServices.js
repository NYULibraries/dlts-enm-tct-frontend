angular.module('editorial')
.factory('Automatic', ['BaseUrl', '$resource', function (BaseUrl, $resource) {
  var services = {},
      _api = $resource(BaseUrl + 'api/epub/automatic-relations/:basketID/', {}, {
        reRun: { method: 'PUT' }
      });

  services.runRules = function (basketID, success, failure) {
      return _api.reRun({basketID: basketID}, {}, success, failure);
  };

  return services;
}]);
