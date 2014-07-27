angular.module('adaptv.adaptStrap.tableajax', [])
  .provider('$tableajax', function () {
    var defaults = this.defaults = {
      expandIconClass: 'glyphicon glyphicon-plus-sign',
      collapseIconClass: 'glyphicon glyphicon-minus-sign',
      loadingIconClass: 'glyphicon glyphicon-refresh ad-spin'
    };
    this.$get = function () {
      return {
        settings: defaults
      };
    };
  })

/**
 * Use this directive if you need to render a table that loads data from ajax.
 */
  .directive('adTableAjax', ['$q', '$http', '$compile', '$filter', '$templateCache', '$adPaging', 'adStrapUtils',
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
          localConfig: {
            pagingArray: []
          },
          ajaxConfig: scope.$eval(attrs.ajaxConfig),
          applyFilter: adStrapUtils.applyFilter
        };

        // ---------- Local data ---------- //
        var tableModels = scope[attrs.tableName],
          mainTemplate = $templateCache.get('tableajax/tableajax.tpl.html');

        // ---------- ui handlers ---------- //
        tableModels.loadPage = function (page) {
          $adPaging.loadPage(page, tableModels.items.paging.pageSize, tableModels.ajaxConfig).then(
            function (response) {
              tableModels.items.list = response.items;
              tableModels.items.paging.totalPages = response.totalPages;
              tableModels.items.paging.currentPage = response.currentPage;
              tableModels.localConfig.pagingArray = response.pagingArray;
            }
          );
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

        // ---------- initialization and event listeners ---------- //
        //We do the compile after injecting the name spacing into the template.
        tableModels.loadPage(1);

        attrs.tableClasses = attrs.tableClasses || 'table';
        mainTemplate = mainTemplate.replace(/%=tableName%/g, attrs.tableName).
          replace(/%=columnDefinition%/g, attrs.columnDefinition).
          replace(/%=tableClasses%/g, attrs.tableClasses);
        angular.element(element).html($compile(mainTemplate)(scope));
      }

      return {
        restrict: 'E',
        link: _link
      };
    }]);
