angular.module('editorial')
.factory('Report', ['Settings', '$resource', function (Settings, $resource) {
  var services = {},
      _api = $resource(Settings.baseUrl + 'api/review/reports/:reportID/', {}, {
        all: { method: 'GET', params: { reportID: 'all' }, isArray: true},
        allTypes: { method: 'GET', params: { reportID: 'types' }, isArray: true},
        destroy: { method: 'DELETE'},
        generate: { method: 'POST', params: {reportID: 'new'}}
      });

  services.all = function (success, failure) {
    return _api.all(success, failure);
  };

  services.allTypes = function (success, failure) {
    return _api.allTypes(success, failure);
  };

  services.destroy = function (reportID, success, failure) {
    return _api.destroy({reportID: reportID}, success, failure);
  };

  services.generate = function (report_type, success, failure) {
    return _api.generate({report_type: report_type}, success, failure);
  };

  return services;
}]);
