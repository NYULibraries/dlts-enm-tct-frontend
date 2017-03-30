angular.module('editorial')
.factory('Index', ['Settings', '$resource', function (Settings, $resource) {
  var services = {},
      _api = $resource(Settings.baseUrl + 'api/epub/index/:indexID/', {}, {
        fromLocation: {method: 'GET', isArray: true}
      });

  services.fromLocation = function (locationID, success, failure) {
    return _api.fromLocation({indexID: locationID}, success, failure);
  };

  return services;
}]);
