angular.module('editorial')
.factory('Document', ['$resource', 'BaseUrl', function ($resource, BaseUrl) {
  var services = {},
      _epub = $resource(BaseUrl + 'api/epub/document/:docID/', {}, {
        all: {method: 'GET', params: {docID: 'all'}, isArray: true},
        detail: {method: 'GET'},
        detailWithOccurrences: {method: 'GET', params: {withOccurrences: "True"}, isArray: true},
      }),
      _document = $resource(BaseUrl + 'api/occurrence/document/:docID/', {}, {
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
