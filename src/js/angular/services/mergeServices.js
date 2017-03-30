angular.module('editorial')
.factory('Merge', ['$resource', 'Settings', function ($resource, Settings) {
  var services = {},
      _merging = $resource(Settings.baseUrl + 'api/hit/basket/:basketID/', {}, {
        single: {method: 'POST', params: {basketID: 'merge'}},
        mergeByHits: {method: 'PATCH', params: {basketID: 'merge-by-hits'}}
      });
      

  services.merge = function (basket_discarded_id, basket_remaining_id, success, failure) {
    return _merging.single({},{
      basket_discarded_id: basket_discarded_id,
      basket_remaining_id: basket_remaining_id
    }, success, failure);
  };


  services.byHits = function (hit_ids, success, failure) {
    return _merging.mergeByHits({}, {hit_ids: hit_ids}, success, failure);
  };

  return services;
}]);
