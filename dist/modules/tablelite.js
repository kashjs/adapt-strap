/**
 * adapt-strap
 * @version v0.1.2 - 2014-07-29
 * @link https://github.com/Adaptv/adapt-strap
 * @author Kashyap Patel (kashyap@adap.tv)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
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
  function ($parse, $http, $compile, $filter, $templateCache, adStrapUtils) {
    'use strict';
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
      tableModels.loadPage = function (page) {
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
      };
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
    }
    return {
      restrict: 'E',
      link: _link
    };
  }
]);