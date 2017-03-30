angular.module('editorial')
.factory('Extraction', ['$resource', 'Settings', function ($resource, Settings) {
  var services = {},
      _extraction = $resource(Settings.baseUrl + 'api/extract/:extractID/', {}, {
        single: {method: 'POST', params: {extractID: 'single'}},
        reprocess: {method: 'POST', params: {extractID: 'reprocess-all'}}
      });

  services.single = function (source, success, failure) {
    return _extraction.single({}, {source: source}, success, failure);
  };

  services.reprocess = function (sources, success, failure) {
    return _extraction.reprocess({}, {sources: sources}, success, failure);
  };

  return services;
}]);
