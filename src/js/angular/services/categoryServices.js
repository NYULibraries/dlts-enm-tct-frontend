angular.module('editorial')
.factory('Category', ['$resource', 'Settings', function ($resource, Settings) {
  var services = {},
      _categoryAPI = $resource(Settings.baseUrl +'api/category/:categoryID/', {}, {
        remove: {method: 'DELETE'}
      });

  services.remove = function (category_name, success, failure) {
    return _categoryAPI.remove({categoryID: category_name}, success, failure);
  };

  return services;
}]);
