angular.module('editorial')
.factory('Hit', ['$resource', 'Settings', 'Utils', function ($resource, Settings, Utils) {
  var services = {},
      _storedList,
      _currentIndex, 
      _checkStoredData = function () {
        if(!_storedList) {
          if (localStorage.getItem('storedList')) {
            _storedList = JSON.parse(localStorage.getItem('storedList'));
          } else {
            _storedList = [];
          }
        }


        if(!_currentIndex) {
          _currentIndex = JSON.parse(localStorage.getItem('currentIndex'));
        }
      };


  var _multipleHits = $resource(Settings.baseUrl + 'api/hit/hits/:hitAction/',{},{
    search: {method:'GET', params: {hitAction: 'search'}, isArray: true},
    byType: {method:'GET', params: {hitAction: 'search'}, isArray: true},
    getAll: {method:'GET', params: {hitAction: 'all'}, isArray: true},
    bypassed: {method:'GET', params: {hitAction: 'bypassed'}, isArray: true},
    bulkBypass: {method:'PATCH', params: {hitAction: 'bulkBypass'}},
    bulkUnbypass: {method:'PATCH', params: {hitAction: 'bulkUnbypass'}},
    byScope: {method: 'GET', params: {hitAction: 'search'}, isArray: true}
  });

  var _singleHit = $resource(Settings.baseUrl + 'api/hit/hits/:process/:hitID/',{},{
    update: {method:'PUT', params:{'process' : 'update'}},
    deletehit: {method:'DELETE', params:{'process' : 'delete'}},
    unhide: {method:'GET', params:{'process': 'unhide'}},
    create: {method:'POST', params:{'process': 'create', 'hitID': 'new'}},
    setBypass: {method: 'PATCH', params: {process: 'bypass'}}
  });

  services.getLetterList = function(letter, success, failure) {
    return _multipleHits.search({letter:letter}, success, failure);
  };

  services.all = function(success, failure) {
    return _multipleHits.getAll(success, failure);
  };

  services.bypassed = function() {
    return _multipleHits.bypassed();
  };

  services.set_bypass = function (hitID, bypass_val, success, failure) {
    return _singleHit.setBypass({hitID: hitID}, {bypass_val: bypass_val}, success, failure);
  };

  services.bulkBypass = function(hits, success, failure) {
    return _multipleHits.bulkBypass({}, {hits: hits}, success, failure);
  };

  services.bulkUnbypass = function(hits, success, failure) {
    return _multipleHits.bulkUnbypass({}, {hits: hits}, success, failure);
  };

  services.search = function (name, success, failure) {
    return _multipleHits.search({name: name}, success, failure);
  };

  services.byType = function (ttype, success, failure) {
    return _multipleHits.search({ttype: ttype}, success, failure);
  };

  services.byScope = function (scope_name, success, failure) {
    return _multipleHits.search({scope: scope_name}, success, failure);
  };

  services.update = function (id, data, success, failure) {
    return _singleHit.update({hitID: id}, data, success, failure);
  };

  services.deletehit = function (id, success, failure) {
    return _singleHit.deletehit({hitID: id}, success, failure);
  };

  services.unhide = function (id, success) {
    return _singleHit.unhide({hitID: id}, success);
  };

  services.create = function (data, success) {
    return _singleHit.create({}, data, success);
  };

  services.displayName = function (name, scope, preferred) {
    var isPreferred = preferred || false;

    var display = isPreferred ? '*' + name : name;
    display = scope === 'Generic' ? display : display + " [as " + scope + "]";

    return display;

  };

  // Given a name and a list of hits, returns whether that hit is in the list
  services.nameInHits = function (name, hits) {
    return hits.some(function (hit) { return hit.name === name; });
  };

  // Stored information for Topic navigation from hit lists
  services.storeList = function (hits) {
    _storedList = hits;

    if (hits.length < 5000) {
      localStorage.setItem('storedList', JSON.stringify(hits));
    } else {
      localStorage.setItem('storedList', '[]');
    }
  };

  services.setCurrentHit = function (index) {
    _currentIndex = index;
    localStorage.setItem('currentIndex', index);
  };


  services.nextHit = function () {
    _checkStoredData();

    var offset = 1,
        next = _storedList[_currentIndex + offset];

    while (next && next.basket === _storedList[_currentIndex].basket) {
      offset++;
      next = _storedList[_currentIndex + offset];
    }

    return next;
  };

  services.previousHit = function () {
    _checkStoredData();

    var offset = 1,
        previous= _storedList[_currentIndex - offset];

    while (previous && previous.basket === _storedList[_currentIndex].basket) {
      offset++;
      previous = _storedList[_currentIndex - offset];
    }

    return previous;
  };

  services.setNextHit = function (hit) {
    _currentIndex = Utils.arrayIndexByValue(_storedList, hit.id);
    localStorage.setItem('currentIndex', _currentIndex);
  };

  services.setPreviousHit = function (hit) {
    _currentIndex = Utils.arrayIndexByValue(_storedList, hit.id);
    localStorage.setItem('currentIndex', _currentIndex);
  };

  return services;
}]);
