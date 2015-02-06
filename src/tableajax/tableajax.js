angular.module('adaptv.adaptStrap.tableajax', ['adaptv.adaptStrap.utils', 'adaptv.adaptStrap.loadingindicator'])
/**
 * Use this directive if you need to render a table that loads data from ajax.
 */
  .directive('adTableAjax',
  ['$parse', '$filter', '$adConfig', 'adLoadPage', 'adDebounce', 'adStrapUtils',
    function ($parse, $filter, $adConfig, adLoadPage, adDebounce, adStrapUtils) {
      'use strict';
      function controllerFunction($scope, $attrs) {
        // ---------- $scope initialization ---------- //
        $scope.attrs = $attrs;
        $scope.iconClasses = $adConfig.iconClasses;
        $scope.adStrapUtils = adStrapUtils;
        $scope.tableClasses = $adConfig.componentClasses.tableAjaxClass;
        $scope.onDataLoadedCallback = $parse($attrs.onDataLoaded) || null;
        $scope.items = {
          list: undefined,
          paging: {
            currentPage: 1,
            totalPages: undefined,
            totalItems: undefined,
            pageSize: Number($attrs.pageSize) || $adConfig.paging.pageSize,
            pageSizes: $parse($attrs.pageSizes)() || $adConfig.paging.pageSizes
          }
        };
        $scope.localConfig = {
          pagingArray: [],
          loadingData: false,
          showNoDataFoundMessage: false,
          tableMaxHeight: $attrs.tableMaxHeight,
          expandedItems: []
        };
        $scope.ajaxConfig = $scope.$eval($attrs.ajaxConfig);
        $scope.columnDefinition = $scope.$eval($attrs.columnDefinition);
        $scope.visibleColumnDefinition = $filter('filter')($scope.columnDefinition, $scope.columnVisible);

        // ---------- Local data ---------- //
        var lastRequestToken,
          watchers = [];

        if ($scope.items.paging.pageSizes.indexOf($scope.items.paging.pageSize) < 0) {
          $scope.items.paging.pageSize = $scope.items.paging.pageSizes[0];
        }

        // ---------- ui handlers ---------- //
        $scope.loadPage = adDebounce(function (page) {
          $scope.collapseAll();
          lastRequestToken = Math.random();
          $scope.localConfig.loadingData = true;
          $scope.localConfig.showNoDataFoundMessage = false;
          var pageLoader = $scope.$eval($attrs.pageLoader) || adLoadPage,
            params = {
              pageNumber: page,
              pageSize: $scope.items.paging.pageSize,
              sortKey: $scope.localConfig.predicate,
              sortDirection: $scope.localConfig.reverse,
              ajaxConfig: $scope.ajaxConfig,
              token: lastRequestToken
            },
            successHandler = function (response) {
              if (response.token === lastRequestToken) {
                $scope.items.list = response.items;
                $scope.items.paging.totalPages = response.totalPages;
                $scope.items.paging.totalItems = response.totalItems;
                $scope.items.paging.currentPage = response.currentPage;
                $scope.localConfig.pagingArray = response.pagingArray;
                $scope.localConfig.loadingData = false;
              }

              if (!response.totalPages) {
                $scope.localConfig.showNoDataFoundMessage = true;
              }

              if ($scope.onDataLoadedCallback) {
                $scope.onDataLoadedCallback($scope, {
                  $success: true,
                  $response: response
                });
              }
            },
            errorHandler = function () {
              $scope.localConfig.loadingData = false;
              $scope.localConfig.showNoDataFoundMessage = true;
              if ($scope.onDataLoadedCallback) {
                $scope.onDataLoadedCallback($scope, {
                  $success: false,
                  $response: null
                });
              }
            };

          pageLoader(params).then(successHandler, errorHandler);
        });

        $scope.loadNextPage = function () {
          if (!$scope.localConfig.loadingData) {
            if ($scope.items.paging.currentPage + 1 <= $scope.items.paging.totalPages) {
              $scope.loadPage($scope.items.paging.currentPage + 1);
            }
          }
        };

        $scope.loadPreviousPage = function () {
          if (!$scope.localConfig.loadingData) {
            if ($scope.items.paging.currentPage - 1 > 0) {
              $scope.loadPage($scope.items.paging.currentPage - 1);
            }
          }
        };

        $scope.loadLastPage = function () {
          if (!$scope.localConfig.loadingData) {
            if ($scope.items.paging.currentPage !== $scope.items.paging.totalPages) {
              $scope.loadPage($scope.items.paging.totalPages);
            }
          }
        };

        $scope.pageSizeChanged = function (size) {
          if (Number(size) !== $scope.items.paging.pageSize) {
            $scope.items.paging.pageSize = Number(size);
            $scope.loadPage(1);
          }
        };

        $scope.columnVisible = function(column) {
          return column.visible !== false;
        };

        $scope.sortByColumn = function (column) {
          var initialSortDirection = true;
          if ($attrs.onClickSortDirection === 'DEC') {
            initialSortDirection = false;
          }
          if (column.sortKey) {
            if (column.sortKey !== $scope.localConfig.predicate) {
              $scope.localConfig.predicate = column.sortKey;
              $scope.localConfig.reverse = initialSortDirection;
            } else {
              if ($scope.localConfig.reverse === initialSortDirection) {
                $scope.localConfig.reverse = !initialSortDirection;
              } else {
                $scope.localConfig.reverse = undefined;
                $scope.localConfig.predicate = undefined;
              }
            }
            $scope.loadPage($scope.items.paging.currentPage);
          }
        };

        $scope.collapseAll = function () {
          $scope.localConfig.expandedItems.length = 0;
        };

        $scope.getRowClass = function (item, index) {
          var rowClass = '';
          if ($attrs.rowClassProvider) {
            rowClass += $scope.$eval($attrs.rowClassProvider)(item, index);
          }
          return rowClass;
        };

        $scope.toggle = function(event, index, item) {
          event.stopPropagation();
          adStrapUtils.addRemoveItemFromList(index, $scope.localConfig.expandedItems);
          if (adStrapUtils.itemExistsInList(index, $scope.localConfig.expandedItems)) {
            var rowExpandCallback = $scope.$eval($attrs.rowExpandCallback);
            if (rowExpandCallback) {
              rowExpandCallback(item);
            }
          }
        };

        // ---------- initialization and event listeners ---------- //
        $scope.loadPage(1);

        // reset on parameter change
        watchers.push(
          $scope.$watch($attrs.ajaxConfig, function () {
            $scope.loadPage(1);
          }, true)
        );
        watchers.push(
          $scope.$watchCollection($attrs.columnDefinition, function () {
            $scope.columnDefinition = $scope.$eval($attrs.columnDefinition);
            $scope.visibleColumnDefinition = $filter('filter')($scope.columnDefinition, $scope.columnVisible);
          })
        );

        // ---------- disable watchers ---------- //
        $scope.$on('$destroy', function () {
          watchers.forEach(function (watcher) {
            watcher();
          });
        });
      }

      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'tableajax/tableajax.tpl.html',
        controller: ['$scope', '$attrs', controllerFunction]
      };
    }]);
