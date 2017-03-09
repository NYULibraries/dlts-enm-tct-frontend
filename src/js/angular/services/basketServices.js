angular.module('editorial')
.factory('Basket',['BaseUrl','$resource', function (BaseUrl, $resource) {
  var services = {};

  var _singleBasket = $resource(BaseUrl + 'api/hit/basket/:basketID/',{},{
    get: {method: 'GET'},
    remove: {method: 'DELETE'},
    detach: {method: 'POST', params: {basketID: 'detach'}},
    add: {method: 'POST', params: {basketID: 'new'}}
  });

  var _singleBasketSpecific = $resource(BaseUrl + 'api/hit/basket/:basketID/:basketAction/', {}, {
    addType: {method: 'PATCH', params: {basketAction: 'add-type'}}
  });

  var _hitManager = $resource(BaseUrl + 'api/hit/hits/:HitAction/', {}, {
    createNewHit: {method: 'POST', params:{'HitAction': 'add-by-basket'}},
    createNewHitSameSlug: {method: 'POST', params:{'HitAction': 'add-hit-same-slug'}},
    createNewHitDisambiguation: {method: 'PATCH', params: {'HitAction': 'disambiguate'}}
  });

  services.detail = function(basketID, success, failure) {
    return _singleBasket.get({basketID: basketID, add_types: 'True'}, success, failure);
  };

  services.remove = function(basketID, success, failure) {
    return _singleBasket.remove({basketID: basketID}, success, failure);
  };

  services.hitListUrl = function (basket_id) {
    return BaseUrl + 'api/hit/hits/search/?as_object=True&exclude_baskets=' + basket_id + '&name=';
  };

  services.addNewHit = function(basketId, hitName, success, failure) {
    return _hitManager.createNewHit({'basket_id':basketId, 'hit_name': hitName}, success, failure);
  };


  services.detach = function (old_basket_id, hit_id, split_data, success, failure) {
    return _singleBasket.detach({}, {
      basket_id: old_basket_id,
      hit_id: hit_id,
      split_data: split_data
    }, success);
  };

  services.addType = function (basket_id, ttype, success, failure) {
    return _singleBasketSpecific.addType({basketID: basket_id}, ttype, success, failure);
  };

  services.addNewHitDisambiguation = function (hit_list, success, failure) {
    return _hitManager.createNewHitDisambiguation({}, {'hits': hit_list}, success, failure);
  };

  services.findPreferredName = function (basket) {
    var preferredName = '';

    for (var i = 0; i < basket.topic_hits.length; i++){
      if (basket.topic_hits[i].preferred) {
        preferredName = basket.topic_hits[i].name;
      }
    }

    if (!preferredName) {
      preferredName = basket.topic_hits[0].name;
    }

    return preferredName;
  };

  services.add = function (hit_name, success, failure) {
    return _singleBasket.add({}, {hit: hit_name}, success, failure);
  };

  services.parseBasketData = function (basket) {
      // get proper relation display
      for (var i=0; i < basket.relations.length; i++) {
        var relation = basket.relations[i];

        relation.type_name = relation.direction === 'source' ? relation.relationtype.role_to : relation.relationtype.role_from;
      }

      return basket;
  };

  return services;
}]);