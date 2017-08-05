angular.module('editorial')
.factory('Relation',['Settings', '$resource', function (Settings, $resource) {
  var services = {};

  var _relatedBasket = $resource(Settings.baseUrl + 'api/relation/:relatedBasketID/',{},{
    remove: {method: 'DELETE'},
    defaultRelation: {method: 'POST',params: {relatedBasketID: 'new-default'}},
    full: {method: 'POST', params: {relatedBasketID: 'new'}},
    edit: {method: 'PUT'},
    bulkDelete: {method: 'PATCH', params: {relatedBasketID: 'bulk-delete'}},
    list: { method: 'GET', params: { relatedBasketID: 'list' }, isArray: true }
  });

  var _rtypes = $resource(Settings.baseUrl + 'api/relation/rtype/:rtypeID/', {}, {
    all: {method: 'GET', params: {rtypeID: 'all'}, isArray: true},
    add: {method: 'POST', params: {rtypeID: 'new'}},
    withCounts: {method: 'GET', params: {rtypeID: 'with-counts'}, isArray: true},
    destroy: {method: 'DELETE'},
    update: {method: 'PUT'}
  });

  var _details = $resource(Settings.baseUrl + 'api/relation/:detailType/:itemID/', {}, {
    forbiddenByBasket: { method: 'GET', params: { detailType: 'forbidden' }, isArray: true},
  });

  services.allTypes = function () {
    return _rtypes.all();
  };

  services.list = function (rtype, success, failure) {
    return _relatedBasket.list({ rtype: rtype }, success, failure);
  };

  services.newType = function (newType, success, failure) {
    return _rtypes.add({}, newType, success, failure);
  };

  services.destroyType = function (rtypeID, success, failure) {
    return _rtypes.destroy({rtypeID: rtypeID}, success, failure);
  };

  services.updateType = function (rtype, success, failure) {
    return _rtypes.update({rtypeID: rtype.id}, rtype, success, failure);
  };

  services.removeRelation = function (id, success, failure) {
    return _relatedBasket.remove({relatedBasketID: id},{display: false}, success, failure);
  };

  services.newDefault = function (source_id, destination_id, success, failure) {
    return _relatedBasket.defaultRelation({source: source_id, destination: destination_id}, success, failure);
  };

  services.create = function (data, success) {
    return _relatedBasket.full({}, data, success);
  };

  services.edit = function (data, success, failure) {
    return _relatedBasket.edit({relatedBasketID: data.id}, data, success, failure);
  };

  services.typesWithCounts = function () {
    return _rtypes.withCounts();
  };

  services.bulkDelete = function (relation_ids, success, failure) {
    return _relatedBasket.bulkDelete({}, {relation_ids: relation_ids}, success, failure);
  };

  services.forbiddenByBasket = function (basket_id, success, failure) {
    return _details.forbiddenByBasket({ itemID: basket_id }, success, failure);
  };

  return services;
}]);
