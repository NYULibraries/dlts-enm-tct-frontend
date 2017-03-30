angular.module('editorial')
.factory('Weblink', ['$resource', 'Settings', function ($resource, Settings) {
  var services = {};

  var _weblinkAPI = $resource(Settings.baseUrl + 'api/weblink/:linkID/', {}, {
    'newLink': {method: 'POST', params: {linkID: 'new'}},
    'discard': {method: 'PATCH'},
    'list': {method: 'GET', params: {linkID: 'list'}, isArray: true},
    'destroy': {method: 'DELETE'},
    'update': {method: 'PUT'},
    'batch_update': {method: 'PUT', params: {linkID: 'batch'}, isArray: true}
  });

  services.newLink = function (basket_id, link, success, failure) {
    return _weblinkAPI.newLink({}, {'basket_id': basket_id, weblink: link}, success, failure);
  };

  services.discard = function (link_id, basket_id, success, failure) {
    return _weblinkAPI.discard({linkID: link_id}, {detach_id: basket_id}, success, failure);
  };

  services.destroy = function (link_id, success, failure) {
    return _weblinkAPI.destroy({linkID: link_id}, success, failure);
  };

  services.update = function (link_data, success, failure) {
    return _weblinkAPI.update({linkID: link_data.id}, link_data, success, failure);
  };

  services.batch = function (bulk_data, success, failure) {
    return _weblinkAPI.batch_update({}, bulk_data, success, failure);
  };

  services.listByBasket = function (basket_id, success, failure) {
    return _weblinkAPI.list({basket_id: basket_id}, success, failure);
  };

  return services;
}]);
