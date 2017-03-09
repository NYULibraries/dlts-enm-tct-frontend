angular.module('editorial')
.factory('Category', ['$resource', 'BaseUrl', function ($resource, BaseUrl) {
  var services = {},
      _categoryAPI = $resource(BaseUrl+'api/category/:categoryID/', {}, {
        remove: {method: 'DELETE'}
      });

  services.remove = function (category_name, success, failure) {
    return _categoryAPI.remove({categoryID: category_name}, success, failure);
  };

  return services;
}]);
