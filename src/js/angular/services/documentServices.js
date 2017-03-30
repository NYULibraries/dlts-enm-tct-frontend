angular.module('editorial')
.factory('Document', ['$resource', 'Settings', function ($resource, Settings) {
  var services = {},
      _epub = $resource(Settings.baseUrl + 'api/epub/document/:docID/', {}, {
        all: {method: 'GET', params: {docID: 'all'}, isArray: true},
        detail: {method: 'GET'},
        detailWithOccurrences: {method: 'GET', params: {withOccurrences: "True"}, isArray: true},
      }),
      _document = $resource(Settings.baseUrl + 'api/occurrence/document/:docID/', {}, {
        remove: {method: 'DELETE'}
      });

  services.getAll = function () {
    return _epub.all();
  };

  services.detail = function (docID, success, failure) {
    return _epub.detail({docID: docID}, success, failure);
  };

  services.detailWithOccurrences = function (docID, success, failure) {
    return _epub.detailWithOccurrences({docID: docID}, success, failure);
  };

  services.remove = function (docID, success, failure) {
    return _document.remove({docID: docID}, success, failure);
  };

  return services;
}]);
