/**
 * adapt-strap
 * @version v0.1.3 - 2014-07-29
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
        if (obj) {
          while (arr.length) {
            if (obj) {
              obj = obj[arr.shift()];
            }
          }
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
]).constant('adDebounce', function (func, wait, immediate) {
  var timeout, args, context, timestamp, result;
  return function () {
    context = this;
    args = arguments;
    timestamp = new Date();
    var later = function () {
      var last = new Date() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
        }
      }
    };
    var callNow = immediate && !timeout;
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) {
      result = func.apply(context, args);
    }
    return result;
  };
}).provider('$adPaging', function () {
  var defaults = this.defaults = {
      request: {
        start: 'skip',
        pageSize: 'limit',
        page: 'page'
      },
      response: {
        itemsLocation: 'data',
        totalItems: 'pagination.totalCount'
      }
    };
  return { settings: defaults };
}).factory('adLoadPage', [
  '$adPaging',
  '$q',
  '$http',
  'adStrapUtils',
  function ($adPaging, $q, $http, adStrapUtils) {
    return function (pageToLoad, pageSize, ajaxConfigOriginal, identityToken) {
      var start = (pageToLoad - 1) * pageSize, i, startPagingPage, success, err, defer = $q.defer(), pagingConfig = angular.copy($adPaging.settings), ajaxConfig = angular.copy(ajaxConfigOriginal);
      if (ajaxConfig.paginationConfig && ajaxConfig.paginationConfig.request) {
        angular.extend(pagingConfig.request, ajaxConfig.paginationConfig.request);
      }
      if (ajaxConfig.paginationConfig && ajaxConfig.paginationConfig.response) {
        angular.extend(pagingConfig.response, ajaxConfig.paginationConfig.response);
      }
      ajaxConfig.params[pagingConfig.request.start] = start;
      ajaxConfig.params[pagingConfig.request.pageSize] = pageSize;
      ajaxConfig.params[pagingConfig.request.page] = pageToLoad;
      success = function (res) {
        var response = {
            items: adStrapUtils.evalObjectProperty(res, pagingConfig.response.itemsLocation),
            currentPage: pageToLoad,
            totalPages: Math.ceil(adStrapUtils.evalObjectProperty(res, pagingConfig.response.totalItems) / pageSize),
            pagingArray: [],
            identityToken: identityToken
          };
        startPagingPage = Math.ceil(pageToLoad / pageSize) * pageSize - (pageSize - 1);
        for (i = 0; i < 5; i++) {
          if (startPagingPage + i > 0 && startPagingPage + i <= response.totalPages) {
            response.pagingArray.push(startPagingPage + i);
          }
        }
        defer.resolve(response);
      };
      err = function (error) {
        defer.reject(error);
      };
      if (ajaxConfig.method === 'JSONP') {
        $http.jsonp(ajaxConfig.url + '?callback=JSON_CALLBACK', ajaxConfig).success(success).error(err);
      } else {
        $http(ajaxConfig).success(success).error(err);
      }
      return defer.promise;
    };
  }
]);