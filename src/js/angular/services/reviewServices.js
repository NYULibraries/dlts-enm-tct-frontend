angular.module('editorial')
.factory('Review', ['$resource', 'Settings', function ($resource, Settings) {
  var services = {},
      _api = $resource(Settings.baseUrl + 'api/review/:basketID/', {}, {
        set: {method: 'PUT'},
        get: {method: 'GET'}
      }),
      _hit_api = $resource(Settings.baseUrl + 'api/review/hits/:hitAction/', {}, {
        search: {method:'GET', params: {hitAction: 'search'}, isArray: true},
        byType: {method:'GET', params: {hitAction: 'search'}, isArray: true},
        getAll: {method:'GET', params: {hitAction: 'all'}, isArray: true},
      }),
      _basket_api = $resource(Settings.baseUrl + 'api/review/baskets/:basketAction/', {}, {
        getAll: {method: 'GET', params: { basketAction: 'search', counts: 'True' }, isArray: true},
        search: {method: 'GET', params: { basketAction: 'search', counts: 'True'}, isArray: true}
      });

  services.set = function (basketID, reviewed, changed, success, failure) {
    return _api.set({basketID: basketID}, {reviewed: reviewed, changed: changed}, success, failure);
  };

  services.get = function (basketID, success, failure) {
    return _api.get({basketID: basketID}, success, failure);
  };

  services.hitLetterList = function(letter, success, failure) {
    return _hit_api.search({letter: letter}, success, failure);
  };

  services.hitAll = function(success, failure) {
    return _hit_api.getAll(success, failure);
  };

  services.hitSearch = function (name, success, failure) {
    return _hit_api.search({name: name}, success, failure);
  };

  services.hitByType = function (ttype, success, failure) {
    return _hit_api.search({ttype: ttype}, success, failure);
  };

  services.basketAll = function (success, failure) {
    return _basket_api.getAll(success, failure);
  };

  services.basketByLetter = function (letter, success, failure) {
    return _basket_api.search({letter: letter}, success, failure);
  };

  services.basketByDocument = function (docID, success, failure) {
    return _basket_api.search({document: docID}, success, failure);
  };

  return services;
}]);
