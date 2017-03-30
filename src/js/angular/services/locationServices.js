angular.module('editorial')
.factory('Location', ['$resource', 'Settings', function ($resource, Settings) {
  var services = {};

  var _location = $resource(Settings.baseUrl + 'api/epub/location/:locationID/', {}, {
    allFromDocument: {method: 'GET', params: {allFromDoc: "True"}, isArray: true},
    detail: {method: 'get', isArray: true},
  });

  services.allFromDocument = function (locationID, success, failure) {
    return _location.allFromDocument({locationID: locationID}, success, failure);
  };

  services.get = function (locationID, success) {
    return _location.detail({locationID: locationID}, success);
  };

  return services;
}]);
