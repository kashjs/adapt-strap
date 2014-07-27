/**
 * adapt-strap
 * @version v0.0.3 - 2014-07-27
 * @link https://github.com/Adaptv/adapt-strap
 * @author Kashyap Patel (kashyap@adap.tv)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('adaptv.adaptStrap.utils', []).factory('adStrapUtils', [
  '$filter',
  function ($filter) {
    return {
      evalObjectProperty: function (obj, property) {
        var arr = property.split('.');
        while (arr.length) {
          obj = obj[arr.shift()];
        }
        return obj;
      },
      applyFilter: function (value, filter) {
        var parts, filterOptions;
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
  }
]).provider('$adPaging', function () {
  var defaults = this.defaults = {
      request: {
        start: 'skip',
        pageSize: 'limit',
        page: 'page'
      },
      response: {
        totalItems: 'results.opensearch:totalResults',
        itemsLocation: 'results.artistmatches.artist'
      }
    };
  this.$get = function ($q, $http, adStrapUtils) {
    return {
      loadPage: function (pageToLoad, pageSize, ajaxConfig) {
        var start = (pageToLoad - 1) * pageSize, i, startPagingPage, success, defer = $q.defer();
        ajaxConfig.params[defaults.request.start] = start;
        ajaxConfig.params[defaults.request.pageSize] = pageSize;
        ajaxConfig.params[defaults.request.page] = pageToLoad;
        success = function (res) {
          var response = {
              items: adStrapUtils.evalObjectProperty(res, defaults.response.itemsLocation),
              currentPage: pageToLoad,
              totalPages: Math.ceil(adStrapUtils.evalObjectProperty(res, defaults.response.totalItems) / pageSize),
              pagingArray: []
            };
          startPagingPage = Math.ceil(pageToLoad / pageSize) * pageSize - (pageSize - 1);
          for (i = 0; i < 5; i++) {
            if (startPagingPage + i > 0 && startPagingPage + i <= response.totalPages) {
              response.pagingArray.push(startPagingPage + i);
            }
          }
          defer.resolve(response);
        };
        if (ajaxConfig.method === 'JSONP') {
          $http.jsonp(ajaxConfig.url + '?callback=JSON_CALLBACK', ajaxConfig).success(success);
        } else {
          $http(ajaxConfig).success(success);
        }
        return defer.promise;
      }
    };
  };
});