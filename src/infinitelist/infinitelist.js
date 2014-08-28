angular.module('adaptv.adaptStrap.infinitelist', ['adaptv.adaptStrap.utils', 'adaptv.adaptStrap.loadingindicator'])
/**
 * Use this directive if you need to render a table that loads data from ajax.
 */
  .directive('adInfiniteList',
  ['$parse', '$compile', '$templateCache', '$adConfig', 'adLoadPage', 'adDebounce', 'adStrapUtils',
    function ($parse, $compile, $templateCache, $adConfig, adLoadPage, adDebounce, adStrapUtils) {
      'use strict';
      function _link(scope, element, attrs) {
        // We do the name spacing so the if there are multiple ad-table-ajax on the scope,
        // they don't fight with each other.
        scope[attrs.tableName] = {
          items: {
            list: [],
            paging: {
              currentPage: 1,
              totalPages: undefined,
              pageSize: Number(attrs.pageSize) || 10
            }
          },
          localConfig: {
            loadingData: false
          },
          ajaxConfig: scope.$eval(attrs.ajaxConfig),
          applyFilter: adStrapUtils.applyFilter,
          readProperty: adStrapUtils.getObjectProperty
        };

        // ---------- Local data ---------- //
        var listModels = scope[attrs.tableName],
          mainTemplate = $templateCache.get('infinitelist/infinitelist.tpl.html'),
          lastRequestToken;

        // ---------- ui handlers ---------- //
        listModels.loadPage = adDebounce(function (page) {
          lastRequestToken = Math.random();
          listModels.localConfig.loadingData = true;
          var pageLoader = scope.$eval(attrs.pageLoader) || adLoadPage,
            params = {
              pageNumber: page,
              pageSize: listModels.items.paging.pageSize,
              sortKey: listModels.localConfig.predicate,
              sortDirection: listModels.localConfig.reverse,
              ajaxConfig: listModels.ajaxConfig,
              token: lastRequestToken
            },
            successHandler = function (response) {
              if (response.token === lastRequestToken) {
                listModels.items.list = listModels.items.list.concat(response.items);
                listModels.items.paging.totalPages = response.totalPages;
                listModels.items.paging.currentPage = response.currentPage;
                listModels.localConfig.loadingData = false;
              }
            },
            errorHandler = function () {
              listModels.localConfig.loadingData = false;
            };

          pageLoader(params).then(successHandler, errorHandler);
        });

        listModels.loadNextPage = function () {
          if (!listModels.localConfig.loadingData) {
            if (listModels.items.paging.currentPage + 1 <= listModels.items.paging.totalPages) {
              listModels.loadPage(listModels.items.paging.currentPage + 1);
            }
          }
        };

        // ---------- initialization and event listeners ---------- //
        //We do the compile after injecting the name spacing into the template.
        listModels.loadPage(1);
        // reset on parameter change
        scope.$watch(attrs.ajaxConfig, function () {
          listModels.loadPage(1);
        }, true);
        mainTemplate = mainTemplate.replace(/%=tableName%/g, attrs.tableName);
        element.empty();
        element.append($compile(mainTemplate)(scope));
        var listContainer = angular.element(element).find('ul')[0];
        // infinite scroll handler
        var loadFunction = adDebounce(function () {
          // This is for infinite scrolling.
          // When the scroll gets closer to the bottom, load more items.
          if (listContainer.scrollTop + listContainer.offsetHeight >= listContainer.scrollHeight - 300) {
            listModels.loadNextPage();
          }
        }, 50);
        angular.element(listContainer).on('scroll', function (event) {
          event.stopPropagation();
          loadFunction();
        });
      }

      return {
        restrict: 'E',
        link: _link
      };
    }]);
