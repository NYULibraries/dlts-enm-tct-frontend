angular.module('editorial')
.factory('Ttype',['BaseUrl', '$resource', function (BaseUrl, $resource) {
  var services = {};

  var _ttype = $resource(BaseUrl + 'api/topic/ttype/:ttypeID/', {}, {
    all: {method: 'GET', params: {ttypeID: 'all'}, isArray: true},
    discard: {method: 'PATCH'},
    withCounts: {method: 'GET', params: {ttypeID: 'withCounts'}, isArray: true},
    create: {method: 'POST', params: {ttypeID: 'new'}},
    destroy: {method: 'DELETE'},
    update: {method: 'PUT'}
  });

  services.all = function () {
    return _ttype.all();
  };

  services.listByBasket = function (basket_id) {
    return _ttype.all({basket_id: basket_id});
  };

  services.discard = function (ttype_id, basket_id, success, failure) {
    return _ttype.discard({ttypeID: ttype_id}, {detach_id: basket_id}, success, failure);
  };

  services.allWithCounts = function (success, failure) {
    return _ttype.withCounts(success, failure);
  };

  services.destroy = function (ttype_id, success, failure) {
    return _ttype.destroy({ttypeID: ttype_id}, success, failure);
  };

  services.create = function (ttype, success, failure) {
    return _ttype.create({}, ttype, success, failure);
  };

  services.update = function (ttype, success, failure) {
    return _ttype.update({ttypeID: ttype.id}, ttype, success, failure);
  };

  return services;
}]);
