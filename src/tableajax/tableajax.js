angular.module('adaptv.adaptStrap.tableajax', ['adaptv.adaptStrap.utils'])
/**
 * Use this directive if you need to render a table that loads data from ajax.
 */
  .directive('adTableAjax',
  ['$parse', '$compile', '$templateCache', 'adLoadPage', 'adDebounce', 'adStrapUtils',
    function ($parse, $compile, $templateCache, adLoadPage, adDebounce, adStrapUtils) {
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
              pageSizes: $parse(attrs.pageSizes)() || [10, 25, 50]
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
        var tableModels = scope[attrs.tableName],
          mainTemplate = $templateCache.get('tableajax/tableajax.tpl.html'),
          lastRequestToken;
        tableModels.items.paging.pageSize = tableModels.items.paging.pageSizes[0];

        // ---------- ui handlers ---------- //
        tableModels.loadPage = adDebounce(function (page) {
          lastRequestToken = Math.random();
          tableModels.localConfig.disablePaging = true;
          adLoadPage(
            page,
            tableModels.items.paging.pageSize,
            tableModels.ajaxConfig,
            lastRequestToken
          ).then(
            function (response) {
              if (response.identityToken === lastRequestToken) {
                tableModels.items.list = response.items;
                tableModels.items.paging.totalPages = response.totalPages;
                tableModels.items.paging.currentPage = response.currentPage;
                tableModels.localConfig.pagingArray = response.pagingArray;
                tableModels.localConfig.disablePaging = false;
              }
            },
            function () {
              tableModels.localConfig.disablePaging = false;
            }
          );
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
        mainTemplate = mainTemplate.replace(/%=tableName%/g, attrs.tableName).
          replace(/%=columnDefinition%/g, attrs.columnDefinition).
          replace(/%=tableClasses%/g, attrs.tableClasses).
          replace(/%=paginationBtnGroupClasses%/g, attrs.paginationBtnGroupClasses);
        angular.element(element).html($compile(mainTemplate)(scope));
      }

      return {
        restrict: 'E',
        link: _link
      };
    }]);
