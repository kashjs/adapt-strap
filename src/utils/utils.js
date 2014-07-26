angular.module('adaptv.adaptStrap.utils', [])
  .factory('adStrapUtils', ['$filter', function ($filter) {
    return {
      applyFilter: function (value, filter) {
        var parts,
          filterOptions;
        if (filter) {
          parts = filter.split(':');
          filterOptions = parts[1];
          if (filterOptions) {
            value = $filter(parts[0])(value, filterOptions);
          } else {
            value = $filter(parts[0])(value);
          }
        }
        return value;
      }
    };
  }]);
