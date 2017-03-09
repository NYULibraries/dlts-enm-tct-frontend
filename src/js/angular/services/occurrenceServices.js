angular.module('editorial')
.factory('Occurrence', ['$resource', 'BaseUrl', function ($resource, BaseUrl) {
  var services = {},
      _occurrence = $resource(BaseUrl + 'api/occurrence/occurrence/:occurrenceID/', {}, {
        remove: { method: 'DELETE'},
        create: { method: 'POST', params: {occurrenceID: 'new'}},
        createWithHit: { method: 'POST', params: {occurrenceID: 'newWithHit'}},
        createOnBasket: { method: 'POST', params: { occurrenceID: 'newOnBasket' }},
        move: {method: 'PATCH'}
      });

  services.remove = function (occurrenceID, success, failure) {
    return _occurrence.remove({occurrenceID: occurrenceID}, success, failure);
  };

  services.create = function (locationID, basketID, success, failure) {
    return _occurrence.create({}, {location_id: locationID, basket_id: basketID}, success, failure);
  };

  services.createWithHit = function (locationID, hit_name, success, failure) {
    // trim whitespace from beginning and end of name
    hit_name = hit_name.replace(/^\s+|\s+$/gm,'');
    return _occurrence.createWithHit({}, {location_id: locationID, hit_name: hit_name}, success, failure);
  };

  services.move = function (occurrenceID, basketID, success, failure) {
    return _occurrence.move({occurrenceID: occurrenceID}, {basket: basketID}, success, failure);
  };

  services.createOnBasket = function (locationID, basketID, success, failure) {
    return _occurrence.createOnBasket({}, {location_id: locationID, basket_id: basketID}, success, failure);
  };

  return services;
}]);
