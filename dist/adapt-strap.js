/**
 * adapt-strap
 * @version v0.1.6 - 2014-07-30
 * @link https://github.com/Adaptv/adapt-strap
 * @author Kashyap Patel (kashyap@adap.tv)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function(window, document, undefined) {
'use strict';
// Source: module.js
angular.module('adaptv.adaptStrap', [
  'adaptv.adaptStrap.utils',
  'adaptv.adaptStrap.treebrowser',
  'adaptv.adaptStrap.tablelite',
  'adaptv.adaptStrap.tableajax',
  'adaptv.adaptStrap.loadingindicator'
]).provider('$adConfig', function () {
  var iconClasses = this.iconClasses = {
      expand: 'glyphicon glyphicon-plus-sign',
      collapse: 'glyphicon glyphicon-minus-sign',
      loadingSpinner: 'glyphicon glyphicon-refresh ad-spin'
    }, paging = this.paging = {
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
  this.$get = function () {
    return {
      iconClasses: iconClasses,
      paging: paging
    };
  };
});

// Source: loadingindicator.js
angular.module('adaptv.adaptStrap.loadingindicator', []).directive('adLoadingIcon', [
  '$adConfig',
  '$compile',
  function ($adConfig, $compile) {
    return {
      restrict: 'E',
      compile: function compile() {
        return {
          pre: function preLink(scope, element, attrs) {
            var loadingIconClass = attrs.loadingIconClass || $adConfig.iconClasses.loadingSpinner, ngStyleTemplate = attrs.loadingIconSize ? 'ng-style="{\'font-size\': \'' + attrs.loadingIconSize + '\'}"' : '', template = '<i class="' + loadingIconClass + '" ' + ngStyleTemplate + '></i>';
            element.html($compile(template)(scope));
          }
        };
      }
    };
  }
]).directive('adLoadingOverlay', [
  '$adConfig',
  function ($adConfig) {
    return {
      restrict: 'E',
      templateUrl: 'loadingindicator/loadingindicator.tpl.html',
      scope: {
        loading: '=',
        zIndex: '@',
        position: '@',
        containerClasses: '@',
        loadingIconClass: '@',
        loadingIconSize: '@'
      },
      compile: function compile() {
        return {
          pre: function preLink(scope) {
            scope.loadingIconClass = scope.loadingIconClass || $adConfig.iconClasses.loading;
            scope.loadingIconSize = scope.loadingIconSize || '3em';
          }
        };
      }
    };
  }
]);

// Source: tableajax.js
angular.module('adaptv.adaptStrap.tableajax', ['adaptv.adaptStrap.utils']).directive('adTableAjax', [
  '$parse',
  '$compile',
  '$templateCache',
  'adLoadPage',
  'adDebounce',
  'adStrapUtils',
  function ($parse, $compile, $templateCache, adLoadPage, adDebounce, adStrapUtils) {
function _link(scope, element, attrs) {
      // We do the name spacing so the if there are multiple adap-table-lite on the scope,
      // they don't fight with each other.
      scope[attrs.tableName] = {
        items: {
          list: undefined,
          paging: {
            currentPage: 1,
            totalPages: undefined,
            pageSize: undefined,
            pageSizes: $parse(attrs.pageSizes)() || [
              10,
              25,
              50
            ]
          }
        },
        localConfig: {
          pagingArray: [],
          disablePaging: false
        },
        ajaxConfig: scope.$eval(attrs.ajaxConfig),
        applyFilter: adStrapUtils.applyFilter
      };
      // ---------- Local data ---------- //
      var tableModels = scope[attrs.tableName], mainTemplate = $templateCache.get('tableajax/tableajax.tpl.html'), lastRequestToken;
      tableModels.items.paging.pageSize = tableModels.items.paging.pageSizes[0];
      // ---------- ui handlers ---------- //
      tableModels.loadPage = adDebounce(function (page) {
        lastRequestToken = Math.random();
        tableModels.localConfig.disablePaging = true;
        adLoadPage(page, tableModels.items.paging.pageSize, tableModels.ajaxConfig, lastRequestToken).then(function (response) {
          if (response.identityToken === lastRequestToken) {
            tableModels.items.list = response.items;
            tableModels.items.paging.totalPages = response.totalPages;
            tableModels.items.paging.currentPage = response.currentPage;
            tableModels.localConfig.pagingArray = response.pagingArray;
            tableModels.localConfig.disablePaging = false;
          }
        }, function () {
          tableModels.localConfig.disablePaging = false;
        });
      });
      tableModels.loadNextPage = function () {
        if (!tableModels.localConfig.disablePaging) {
          if (tableModels.items.paging.currentPage + 1 <= tableModels.items.paging.totalPages) {
            tableModels.loadPage(tableModels.items.paging.currentPage + 1);
          }
        }
      };
      tableModels.loadPreviousPage = function () {
        if (!tableModels.localConfig.disablePaging) {
          if (tableModels.items.paging.currentPage - 1 > 0) {
            tableModels.loadPage(tableModels.items.paging.currentPage - 1);
          }
        }
      };
      tableModels.loadLastPage = function () {
        if (!tableModels.localConfig.disablePaging) {
          if (tableModels.items.paging.currentPage !== tableModels.items.paging.totalPages) {
            tableModels.loadPage(tableModels.items.paging.totalPages);
          }
        }
      };
      tableModels.pageSizeChanged = function (size) {
        if (Number(size) !== tableModels.items.paging.pageSize) {
          tableModels.items.paging.pageSize = Number(size);
          tableModels.loadPage(1);
        }
      };
      // ---------- initialization and event listeners ---------- //
      //We do the compile after injecting the name spacing into the template.
      tableModels.loadPage(1);
      // reset on parameter change
      scope.$watch(attrs.ajaxConfig, function () {
        tableModels.loadPage(1);
      }, true);
      attrs.tableClasses = attrs.tableClasses || 'table';
      attrs.paginationBtnGroupClasses = attrs.paginationBtnGroupClasses || 'btn-group btn-group-sm';
      mainTemplate = mainTemplate.replace(/%=tableName%/g, attrs.tableName).replace(/%=columnDefinition%/g, attrs.columnDefinition).replace(/%=tableClasses%/g, attrs.tableClasses).replace(/%=paginationBtnGroupClasses%/g, attrs.paginationBtnGroupClasses);
      angular.element(element).html($compile(mainTemplate)(scope));
    }
    return {
      restrict: 'E',
      link: _link
    };
  }
]);

// Source: tablelite.js
angular.module('adaptv.adaptStrap.tablelite', ['adaptv.adaptStrap.utils']).provider('$tablelite', function () {
  var defaults = this.defaults = {
      expandIconClass: 'glyphicon glyphicon-plus-sign',
      collapseIconClass: 'glyphicon glyphicon-minus-sign',
      loadingIconClass: 'glyphicon glyphicon-refresh ad-spin'
    };
  this.$get = function () {
    return { settings: defaults };
  };
}).directive('adTableLite', [
  '$parse',
  '$http',
  '$compile',
  '$filter',
  '$templateCache',
  'adStrapUtils',
  'adDebounce',
  function ($parse, $http, $compile, $filter, $templateCache, adStrapUtils, adDebounce) {
function _link(scope, element, attrs) {
      // We do the name spacing so the if there are multiple adap-table-lite on the scope,
      // they don't fight with each other.
      scope[attrs.tableName] = {
        items: {
          list: undefined,
          paging: {
            currentPage: 1,
            totalPages: undefined,
            pageSize: undefined,
            pageSizes: $parse(attrs.pageSizes)() || [
              10,
              25,
              50
            ]
          }
        },
        localConfig: { pagingArray: [] },
        applyFilter: adStrapUtils.applyFilter
      };
      // ---------- Local data ---------- //
      var tableModels = scope[attrs.tableName], mainTemplate = $templateCache.get('tablelite/tablelite.tpl.html');
      tableModels.items.paging.pageSize = tableModels.items.paging.pageSizes[0];
      // ---------- ui handlers ---------- //
      tableModels.loadPage = adDebounce(function (page) {
        var start = (page - 1) * tableModels.items.paging.pageSize, end = start + tableModels.items.paging.pageSize, i, startPagingPage, localItems = $filter('orderBy')(scope.$eval(attrs.localDataSource), tableModels.localConfig.predicate, tableModels.localConfig.reverse);
        tableModels.items.list = localItems.slice(start, end);
        tableModels.items.paging.currentPage = page;
        tableModels.items.paging.totalPages = Math.ceil(scope.$eval(attrs.localDataSource).length / tableModels.items.paging.pageSize);
        tableModels.localConfig.pagingArray = [];
        startPagingPage = Math.ceil(page / tableModels.items.paging.pageSize) * tableModels.items.paging.pageSize - (tableModels.items.paging.pageSize - 1);
        for (i = 0; i < 5; i++) {
          if (startPagingPage + i > 0 && startPagingPage + i <= tableModels.items.paging.totalPages) {
            tableModels.localConfig.pagingArray.push(startPagingPage + i);
          }
        }
      });
      tableModels.loadNextPage = function () {
        if (tableModels.items.paging.currentPage + 1 <= tableModels.items.paging.totalPages) {
          tableModels.loadPage(tableModels.items.paging.currentPage + 1);
        }
      };
      tableModels.loadPreviousPage = function () {
        if (tableModels.items.paging.currentPage - 1 > 0) {
          tableModels.loadPage(tableModels.items.paging.currentPage - 1);
        }
      };
      tableModels.loadLastPage = function () {
        if (!tableModels.localConfig.disablePaging) {
          tableModels.loadPage(tableModels.items.paging.totalPages);
        }
      };
      tableModels.pageSizeChanged = function (size) {
        tableModels.items.paging.pageSize = size;
        tableModels.loadPage(1);
      };
      tableModels.sortByColumn = function (column) {
        if (column.sortable) {
          tableModels.localConfig.predicate = column.displayProperty;
          tableModels.localConfig.reverse = !tableModels.localConfig.reverse;
          tableModels.loadPage(tableModels.items.paging.currentPage);
        }
      };
      // ---------- initialization and event listeners ---------- //
      //We do the compile after injecting the name spacing into the template.
      tableModels.loadPage(1);
      attrs.tableClasses = attrs.tableClasses || 'table';
      attrs.paginationBtnGroupClasses = attrs.paginationBtnGroupClasses || 'btn-group btn-group-sm';
      mainTemplate = mainTemplate.replace(/%=tableName%/g, attrs.tableName).replace(/%=columnDefinition%/g, attrs.columnDefinition).replace(/%=paginationBtnGroupClasses%/g, attrs.paginationBtnGroupClasses).replace(/%=tableClasses%/g, attrs.tableClasses);
      angular.element(element).html($compile(mainTemplate)(scope));
      scope.$watch(attrs.localDataSource, function () {
        tableModels.loadPage(1);
      }, true);
    }
    return {
      restrict: 'E',
      link: _link
    };
  }
]);

// Source: treebrowser.js
angular.module('adaptv.adaptStrap.treebrowser', []).directive('adTreeBrowser', [
  '$compile',
  '$http',
  '$adConfig',
  '$templateCache',
  function ($compile, $http, $adConfig, $templateCache) {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        var treeName = attrs.treeName || '', nodeTemplateUrl = attrs.nodeTemplateUrl || '', nodeHeaderUrl = attrs.nodeHeaderUrl || '', childrenPadding = attrs.childrenPadding || 15, template = '', populateMainTemplate = function (nodeTemplate, nodeHeaderTemplate) {
            var data = $templateCache.get('treebrowser/treebrowser.tpl.html');
            template = data.replace(/%=treeName%/g, treeName).replace(/%=treeRootName%/g, attrs.treeRoot).replace(/%=bordered%/g, attrs.bordered).replace(/%=expandIconClass%/g, attrs.expandIconClass || $adConfig.iconClasses.expand).replace(/%=collapseIconClass%/g, attrs.collapseIconClass || $adConfig.iconClasses.collapse).replace(/%=loadingIconClass%/g, attrs.loadingIconClass || $adConfig.iconClasses.loadingSpinner).replace(/%=childNodeName%/g, attrs.childNode).replace(/%=childrenPadding%/g, childrenPadding).replace(/%=rowNgClass%/g, attrs.rowNgClass || '').replace(/%=nodeTemplate%/g, nodeTemplate).replace(/%=nodeHeaderTemplate%/g, nodeHeaderTemplate || '');
            element.empty();
            element.append($compile(template)(scope));
          };
        scope[treeName + 'TreeBrowser'] = {
          toggle: function (event, item) {
            var toggleCallback;
            event.stopPropagation();
            toggleCallback = scope.$eval(attrs.toggleCallback);
            if (toggleCallback) {
              toggleCallback(item);
            } else {
              item._expanded = !item._expanded;
            }
          },
          hasChildren: function (item) {
            var hasChildren = scope.$eval(attrs.hasChildren), found = item[attrs.childNode] && item[attrs.childNode].length > 0;
            if (hasChildren) {
              found = hasChildren(item);
            }
            return found;
          },
          showHeader: nodeHeaderUrl !== '' ? true : false
        };
        if (nodeTemplateUrl !== '') {
          // Getting the template from nodeTemplateUrl
          $http.get(nodeTemplateUrl).success(function (nodeTemplate) {
            if (nodeHeaderUrl !== '') {
              $http.get(nodeHeaderUrl).success(function (headerTemplate) {
                populateMainTemplate(nodeTemplate, headerTemplate);
              });
            } else {
              populateMainTemplate(nodeTemplate, '');
            }
          });
        } else {
          populateMainTemplate('<span>{{ item.name || "" }}</span>');
        }
      }
    };
  }
]);

// Source: utils.js
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

})(window, document);
