angular.module('editorial')
.factory('Scope', ['BaseUrl', '$resource', function (BaseUrl, $resource) {
  var services = {};

  var _scope = $resource(BaseUrl + 'api/hit/scope/:scopeAction/', {}, {
    all: {method: 'GET', isArray: true, params: {scopeAction: 'all'}},
    new: {method: 'POST', params: {scopeAction: 'new'}},
    update: {method: 'PUT'},
    destroy: {method: 'DELETE'},
    withCounts: { method: 'GET', params: {scopeAction: 'with-counts'}, isArray: true} 
  });

  services.getAll = function () {
    return _scope.all();
  };

  services.new = function (name, success) {
    return _scope.new({}, {scope: name}, success);
  };

  services.update = function (scope, success, failure) {
    return _scope.update({scopeAction: scope.id}, scope, success, failure);
  };

  services.destroy = function (scopeID, success, failure) {
    return _scope.destroy({scopeAction: scopeID}, success, failure);
  };

  services.withCounts = function () {
    return _scope.withCounts();
  };

  return services;
}]);
