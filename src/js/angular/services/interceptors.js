angular.module('editorial')
.factory('tokenCleaner', ['$rootScope', '$injector', '$cookies', '$q', function ($rootScope, $injector, $cookies, $q) {
  var interceptor = {
     responseError: function(response) {
      if (response.status === 401 && response.data) {
        if (response.data.detail === 'Invalid token.') {
          $cookies.remove('token');
          $cookies.remove('user');

          var http = $injector.get('$http');
          delete http.defaults.headers.common.Authorization;
          $rootScope.$broadcast("djangoAuth.logged_out");
        }
      }
      return $q.reject(response);
    }
  };

  return interceptor;
}]);
