angular.module('adaptv.adaptStrap.infinitedropdown', ['adaptv.adaptStrap.utils', 'adaptv.adaptStrap.loadingindicator'])
/**
 * Use this directive if you need to render a table that loads data from ajax.
 */
  .directive('adInfiniteDropdown',
  ['$parse', '$compile', '$templateCache', '$adConfig', 'adLoadPage', 'adDebounce', 'adStrapUtils', 'adLoadLocalPage',
    function ($parse, $compile, $templateCache, $adConfig, adLoadPage, adDebounce, adStrapUtils, adLoadLocalPage) {
      'use strict';
      function linkFunction(scope, element, attrs) {
        // scope initialization
        scope.attrs = attrs;
        scope.adStrapUtils = adStrapUtils;
        scope.items = {
          list: [],
          paging: {
            currentPage: 1,
            totalPages: undefined,
            pageSize: Number(attrs.pageSize) || 10
          }
        };
        scope.localConfig = {
          loadingData: false,
          singleSelectionMode: $parse(attrs.singleSelectionMode)() ? true : false,
          dimensions: {
            'max-height': attrs.maxHeight || '200px',
            'max-width': attrs.maxWidth || 'auto'
          }
        };
        scope.selectedItems = scope.$eval(attrs.selectedItems) || [];
        scope.ajaxConfig = scope.$eval(attrs.ajaxConfig) || {};

        // ---------- Local data ---------- //
        var lastRequestToken,
            watchers = [];

        // ---------- ui handlers ---------- //
        scope.addRemoveItem = function(event, item, items) {
          event.stopPropagation();
          if (scope.localConfig.singleSelectionMode) {
            scope.selectedItems[0] = item;
          } else {
            adStrapUtils.addRemoveItemFromList(item, items);
          }
          var callback = scope.$eval(attrs.onItemClick);
          if (callback) {
            callback(item);
          }
        };

        scope.loadPage = adDebounce(function (page) {
          lastRequestToken = Math.random();
          scope.localConfig.loadingData = true;
          var pageLoader = scope.$eval(attrs.pageLoader) || adLoadPage,
            params = {
              pageNumber: page,
              pageSize: scope.items.paging.pageSize,
              sortKey: scope.localConfig.predicate,
              sortDirection: scope.localConfig.reverse,
              ajaxConfig: scope.ajaxConfig,
              token: lastRequestToken
            },
            successHandler = function (response) {
              if (response.token === lastRequestToken) {
                if (page === 1) {
                  scope.items.list = response.items;
                } else {
                  scope.items.list = scope.items.list.concat(response.items);
                }

                scope.items.paging.totalPages = response.totalPages;
                scope.items.paging.currentPage = response.currentPage;
                scope.localConfig.loadingData = false;
              }
            },
            errorHandler = function () {
              scope.localConfig.loadingData = false;
            };
          if (attrs.localDataSource) {
            params.localData = scope.$eval(attrs.localDataSource);
            successHandler(adLoadLocalPage(params));
          } else {
            pageLoader(params).then(successHandler, errorHandler);
          }
        }, 10);

        scope.loadNextPage = function () {
          if (!scope.localConfig.loadingData) {
            if (scope.items.paging.currentPage + 1 <= scope.items.paging.totalPages) {
              scope.loadPage(scope.items.paging.currentPage + 1);
            }
          }
        };

        // ---------- initialization and event listeners ---------- //
        //We do the compile after injecting the name spacing into the template.
        scope.loadPage(1);
        // ---------- set watchers ---------- //
        // reset on parameter change
        if (attrs.ajaxConfig) {
          scope.$watch(attrs.ajaxConfig, function (value) {
            if (value) {
              scope.loadPage(1);
            }
          }, true);
        }
        if (attrs.localDataSource) {
          watchers.push(
            scope.$watch(attrs.localDataSource, function (value) {
              if (value) {
                scope.loadPage(1);
              }
            })
          );
          watchers.push(
            scope.$watch(attrs.localDataSource + '.length', function (value) {
              if (value) {
                scope.loadPage(1);
              }
            })
          );
        }
        // ---------- disable watchers ---------- //
        scope.$on('$destroy', function () {
          watchers.forEach(function (watcher) {
            watcher();
          });
        });

        var listContainer = angular.element(element).find('ul')[0];
        // infinite scroll handler
        var loadFunction = adDebounce(function () {
          // This is for infinite scrolling.
          // When the scroll gets closer to the bottom, load more items.
          if (listContainer.scrollTop + listContainer.offsetHeight >= listContainer.scrollHeight - 300) {
            scope.loadNextPage();
          }
        }, 50);
        angular.element(listContainer).bind('mousewheel DOMMouseScroll scroll', function (event) {
          if (event.originalEvent && event.originalEvent.deltaY) {
            listContainer.scrollTop += event.originalEvent.deltaY;
            event.preventDefault();
            event.stopPropagation();
          }
          loadFunction();
        });
      }

      return {
        restrict: 'E',
        scope: true,
        link: linkFunction,
        templateUrl: 'infinitedropdown/infinitedropdown.tpl.html'
      };
    }]);
