angular.module('editorial')
.factory('Index', ['BaseUrl', '$resource', function (BaseUrl, $resource) {
  var services = {},
      _api = $resource(BaseUrl + 'api/epub/index/:indexID/', {}, {
        fromLocation: {method: 'GET', isArray: true}
      });

  services.fromLocation = function (locationID, success, failure) {
    return _api.fromLocation({indexID: locationID}, success, failure);
  };

  return services;
}]);
