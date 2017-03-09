angular.module('editorial')
.factory('Language', ['BaseUrl', '$resource', function (BaseUrl, $resource) {
  var services = {};

  var _language = $resource(BaseUrl + 'api/language/:languageAction/', {}, {
    list: {method: 'GET', isArray: true, params: {languageAction: 'list'}},
  });

  var _onHit = $resource(BaseUrl + 'api/language/hit/:hitID/', {}, {
    get: {method: 'GET', isArray: true},
    update: {method: 'PUT'}
  });

  services.getAll = function () {
    return _language.list();
  };

  services.getHitLanguages = function (hitID, success, failure) {
    return _onHit.get({hitID: hitID}, success, failure);
  };

  services.updateHitLanguages = function (hitID, languages) {
    return _onHit.update({hitID: hitID}, {languages: languages});
  };

  services.displayLanguage = function (language) {
    return language.variant ? language.language + " (" + language.variant + ")" : language.language;
  };

  services.displayLanguageList = function (languages) {
    if (languages.length < 1 || (languages.length === 1 && languages[0].language === 'English' && !languages[0].variant)) {
      return '';
    } else {
      var language_list = languages.map(function (l) { return services.displayLanguage(l); });
      return language_list.join(', ');
    }
  };

  return services;
}]);
