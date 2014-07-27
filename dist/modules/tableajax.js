/**
 * adapt-strap
 * @version v0.0.3 - 2014-07-27
 * @link https://github.com/Adaptv/adapt-strap
 * @author Kashyap Patel (kashyap@adap.tv)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('adaptv.adaptStrap.tableajax', []).provider('$tableajax', function () {
  var defaults = this.defaults = {
      expandIconClass: 'glyphicon glyphicon-plus-sign',
      collapseIconClass: 'glyphicon glyphicon-minus-sign',
      loadingIconClass: 'glyphicon glyphicon-refresh ad-spin'
    };
  this.$get = function () {
    return { settings: defaults };
  };
}).directive('adTableAjax', [
  '$q',
  '$http',
  '$compile',
  '$filter',
  '$templateCache',
  '$adPaging',
  'adStrapUtils',
  function ($q, $http, $compile, $filter, $templateCache, $adPaging, adStrapUtils) {
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
            pageSize: 5
          }
        },
        localConfig: { pagingArray: [] },
        ajaxConfig: scope.$eval(attrs.ajaxConfig)
      };
      // ---------- Local data ---------- //
      var tableModels = scope[attrs.tableName], mainTemplate = $templateCache.get('tablelite/tablelite.tpl.html');
      // ---------- ui handlers ---------- //
      scope.formatValue = function (value, filter) {
        return adStrapUtils.applyFilter(value, filter);
      };
      scope.loadPage = function (page) {
        $adPaging.loadPage(page, tableModels.items.paging.pageSize, tableModels.ajaxConfig).then(function (response) {
          tableModels.items.list = response.items;
          tableModels.items.paging.totalPages = response.totalPages;
          tableModels.items.paging.currentPage = response.currentPage;
          tableModels.localConfig.pagingArray = response.pagingArray;
        });
      };
      scope.loadNextPage = function () {
        if (tableModels.items.paging.currentPage + 1 <= tableModels.items.paging.totalPages) {
          scope.loadPage(tableModels.items.paging.currentPage + 1);
        }
      };
      scope.loadPreviousPage = function () {
        if (tableModels.items.paging.currentPage - 1 > 0) {
          scope.loadPage(tableModels.items.paging.currentPage - 1);
        }
      };
      // ---------- initialization and event listeners ---------- //
      //We do the compile after injecting the name spacing into the template.
      scope.loadPage(1);
      attrs.tableClasses = attrs.tableClasses || 'table';
      mainTemplate = mainTemplate.replace(/%=tableName%/g, attrs.tableName).replace(/%=columnDefinition%/g, attrs.columnDefinition).replace(/%=tableClasses%/g, attrs.tableClasses);
      angular.element(element).html($compile(mainTemplate)(scope));
    }
    return {
      restrict: 'E',
      link: _link
    };
  }
]);