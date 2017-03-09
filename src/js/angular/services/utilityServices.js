angular.module('editorial')
.factory('Utils',[function () {
  var services = {},
      _remove = function (item, list, type) {
        var index = 0;
        list.some(function(elem, i) {
          if (elem[type] === item[type]) {
            index = i;
            return true;
          }
        });
        list.splice(index,1);
      };

  services.removeFromList = function (item, list) {
    _remove(item, list, 'id');
  };

  services.removeWithType = function (item, list, type) {
    _remove(item, list, type);
  };

  services.bulkRemove = function (list_to_remove, full_list, type) {
    var active_type = type || 'id';

    for (var i=0; i<list_to_remove.length; i++) {
      _remove(list_to_remove[i], full_list, active_type);
    }
  };

  // Get an object in an array that matches a given value
  services.arraySearch = function (array, key, prop) {
    // Optional, but fallback to key['name'] if not selected
    prop = (typeof prop === 'undefined') ? 'id' : prop;    

    for (var i=0; i < array.length; i++) {
      if (array[i][prop] === key) {
        return array[i];
      }
    }
  };

  // Get an object the index of an object in an array that matches a given value
  services.arrayIndexByValue = function (array, key, prop){
    // Optional, but fallback to key['name'] if not selected
    prop = (typeof prop === 'undefined') ? 'id' : prop;    

    for (var i=0; i < array.length; i++) {
      if (array[i][prop] === key) {
        return i;
      }
    }
  };

  // generic sorting array of objects
  services.sortListByProperty = function (array, prop, desc) {
    var descending = desc || false,
        isString = array.length > 0 && (typeof array[0][prop] === 'string' || array[0][prop] instanceof String);

    array.sort(function (a, b) {
      a = isString ? a[prop].replace(/"/g, '').toLowerCase() : a[prop];
      b = isString ? b[prop].replace(/"/g, '').toLowerCase() : b[prop];

      if (a < b) {
        return descending ? 1 : -1;
      }
      if (a > b) {
        return descending ? -1 : 1;
      }

      return 0;
    });

    return array.slice();
  };

  return services;
}]);

