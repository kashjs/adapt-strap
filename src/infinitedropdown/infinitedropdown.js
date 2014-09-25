angular.module('adaptv.adaptStrap.infinitedropdown', ['adaptv.adaptStrap.utils', 'adaptv.adaptStrap.loadingindicator'])
/**
 * Use this directive if you need to render a table that loads data from ajax.
 */
  .directive('adInfiniteDropdown',
  ['$parse', '$compile', '$templateCache', '$adConfig', 'adLoadPage', 'adDebounce', 'adStrapUtils', 'adLoadLocalPage',
    function ($parse, $compile, $templateCache, $adConfig, adLoadPage, adDebounce, adStrapUtils, adLoadLocalPage) {
      'use strict';
      function _link(scope, element, attrs) {
        // We do the name spacing so the if there are multiple ad-table-ajax on the scope,
        // they don't fight with each other.
        scope[attrs.dropdownName] = {
          items: {
            list: [],
            paging: {
              currentPage: 1,
              totalPages: undefined,
              pageSize: Number(attrs.pageSize) || 10
            }
          },
          localConfig: {
            loadingData: false,
            showDisplayProperty: attrs.displayProperty ? true : false,
            showTemplate: attrs.template ? true : false,
            loadTemplate: attrs.templateUrl ? true : false,
            initialLabel: attrs.initialLabel || 'Select',
            singleSelectionMode: $parse(attrs.singleSelectionMode)() ? true : false,
            dynamicLabel: attrs.labelDisplayProperty ? true : false,
            dimensions: {
              'max-height': attrs.maxHeight || '200px',
              'max-width': attrs.maxWidth || 'auto'
            }
          },
          selectedItems: scope.$eval(attrs.selectedItems) || [],
          ajaxConfig: scope.$eval(attrs.ajaxConfig),
          applyFilter: adStrapUtils.applyFilter,
          readProperty: adStrapUtils.getObjectProperty,
          isSelected: adStrapUtils.itemExistsInList
        };

        // ---------- Local data ---------- //
        var listModels = scope[attrs.dropdownName],
          mainTemplate = $templateCache.get('infinitedropdown/infinitedropdown.tpl.html'),
          lastRequestToken,
          watchers = [];

        // ---------- ui handlers ---------- //
        listModels.addRemoveItem = function(event, item, items) {
          event.stopPropagation();
          if (listModels.localConfig.singleSelectionMode) {
            listModels.selectedItems[0] = item;
          } else {
            adStrapUtils.addRemoveItemFromList(item, items);
          }
          var callback = scope.$eval(attrs.onItemClick);
          if (callback) {
            callback(item);
          }
        };

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
                if (page === 1) {
                  listModels.items.list = response.items;
                } else {
                  listModels.items.list = listModels.items.list.concat(response.items);
                }

                listModels.items.paging.totalPages = response.totalPages;
                listModels.items.paging.currentPage = response.currentPage;
                listModels.localConfig.loadingData = false;
              }
            },
            errorHandler = function () {
              listModels.localConfig.loadingData = false;
            };
          if (attrs.localDataSource) {
            params.localData = scope.$eval(attrs.localDataSource);
            successHandler(adLoadLocalPage(params));
          } else {
            pageLoader(params).then(successHandler, errorHandler);
          }
        }, 10);

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
        // ---------- set watchers ---------- //
        // reset on parameter change
        if (attrs.ajaxConfig) {
          scope.$watch(attrs.ajaxConfig, function () {
            listModels.loadPage(1);
          }, true);
        }
        if (attrs.localDataSource) {
          watchers.push(
            scope.$watch(attrs.localDataSource, function () {
              listModels.loadPage(1);
            })
          );
          watchers.push(
            scope.$watch(attrs.localDataSource + '.length', function () {
              listModels.loadPage(1);
            })
          );
        }
        // ---------- disable watchers ---------- //
        scope.$on('$destroy', function () {
          watchers.forEach(function (watcher) {
            watcher();
          });
        });

        mainTemplate = mainTemplate.replace(/%=dropdownName%/g, attrs.dropdownName).
          replace(/%=displayProperty%/g, attrs.displayProperty).
          replace(/%=templateUrl%/g, attrs.templateUrl).
          replace(/%=template%/g, attrs.template).
          replace(/%=labelDisplayProperty%/g, attrs.labelDisplayProperty).
          replace(/%=btnClasses%/g, attrs.btnClasses || 'btn btn-default').
          replace(/%=icon-selectedItem%/g, $adConfig.iconClasses.selectedItem);

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
        angular.element(listContainer).bind('mousewheel', function (event) {
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
        link: _link
      };
    }]);
