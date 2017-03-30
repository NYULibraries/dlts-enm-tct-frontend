angular.module('editorial')
.factory('Automatic', ['Settings', '$resource', function (Settings, $resource) {
  var services = {},
      _api = $resource(Settings.baseUrl + 'api/epub/automatic-relations/:basketID/', {}, {
        reRun: { method: 'PUT' }
      });

  services.runRules = function (basketID, success, failure) {
      return _api.reRun({basketID: basketID}, {}, success, failure);
  };

  return services;
}]);
