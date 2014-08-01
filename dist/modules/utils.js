/**
 * adapt-strap
 * @version v0.1.7 - 2014-08-01
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
]).factory('adDebounce', [
  '$timeout',
  '$q',
  function ($timeout, $q) {
    'use strict';
    var deb = function (func, delay, immediate, ctx) {
      var timer = null, deferred = $q.defer(), wait = delay || 300;
      return function () {
        var context = ctx || this, args = arguments, callNow = immediate && !timer, later = function () {
            if (!immediate) {
              deferred.resolve(func.apply(context, args));
              deferred = $q.defer();
            }
          };
        if (timer) {
          $timeout.cancel(timer);
        }
        timer = $timeout(later, wait);
        if (callNow) {
          deferred.resolve(func.apply(context, args));
          deferred = $q.defer();
        }
        return deferred.promise;
      };
    };
    return deb;
  }
]).factory('adLoadPage', [
  '$adConfig',
  '$q',
  '$http',
  'adStrapUtils',
  function ($adConfig, $q, $http, adStrapUtils) {
    return function (pageToLoad, pageSize, ajaxConfigOriginal, identityToken) {
      var start = (pageToLoad - 1) * pageSize, i, startPagingPage, success, err, defer = $q.defer(), pagingConfig = angular.copy($adConfig.paging), ajaxConfig = angular.copy(ajaxConfigOriginal);
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