angular.module('adaptv.adaptStrap.tablelite', ['adaptv.adaptStrap.utils'])
/**
 * Use this directive if you need to render a simple table with local data source.
 */
  .directive('adTableLite', [
    '$parse', '$http', '$compile', '$filter', '$templateCache',
    '$adConfig', 'adStrapUtils', 'adDebounce', 'adLoadLocalPage',
    function ($parse, $http, $compile, $filter, $templateCache,
              $adConfig, adStrapUtils, adDebounce, adLoadLocalPage) {
      'use strict';
      function controllerFunction($scope, $attrs) {
        // ---------- $$scope initialization ---------- //
        $scope.attrs = $attrs;
        $scope.iconClasses = $adConfig.iconClasses;
        $scope.adStrapUtils = adStrapUtils;
        $scope.tableClasses = $adConfig.componentClasses.tableLiteClass;

        $scope.columnDefinition = $scope.$eval($attrs.columnDefinition);
        $scope.visibleColumnDefinition = $filter('filter')($scope.columnDefinition, $scope.columnVisible);

        $scope.items = {
          list: undefined,
          allItems: undefined,
          paging: {
            currentPage: 1,
            totalPages: undefined,
            pageSize: Number($attrs.pageSize) || $adConfig.paging.pageSize,
            pageSizes: $parse($attrs.pageSizes)() || $adConfig.paging.pageSizes
          }
        };

        $scope.filters = {};

        $scope.localConfig = {
          localData: adStrapUtils.parse($scope.$eval($attrs.localDataSource)),
          pagingArray: [],
          dragChange: $scope.$eval($attrs.onDragChange),
          expandedItems: []
        };

        $scope.selectedItems = $scope.$eval($attrs.selectedItems);
        $scope.searchText = $scope.$eval($attrs.searchText);

        // ---------- Local data ---------- //
        var placeHolder = null,
          placeHolderInDom = false,
          pageButtonElement = null,
          validDrop = false,
          initialPos,
          watchers = [];

        function moveElementNode(nodeToMove, relativeNode, dragNode) {
          if (relativeNode.next()[0] === nodeToMove[0]) {
            relativeNode.before(nodeToMove);
          } else if (relativeNode.prev()[0] === nodeToMove[0]) {
            relativeNode.after(nodeToMove);
          } else {
            if (relativeNode.next()[0] === dragNode[0]) {
              relativeNode.before(nodeToMove);
            } else if (relativeNode.prev()[0] === dragNode[0]) {
              relativeNode.after(nodeToMove);
            }
          }
        }

        if ($scope.items.paging.pageSizes.indexOf($scope.items.paging.pageSize) < 0) {
          $scope.items.paging.pageSize = $scope.items.paging.pageSizes[0];
        }

        // ---------- ui handlers ---------- //
        $scope.loadPage = adDebounce(function (page) {
          $scope.collapseAll();
          var itemsObject,
              params,
              parsedData = adStrapUtils.parse($scope.$eval($attrs.localDataSource));

          $scope.localConfig.localData = !!$scope.searchText ?
            $filter('filter')(parsedData, $scope.searchText) :
            parsedData;

          if ($attrs.enableColumnSearch && adStrapUtils.hasAtLeastOnePropertyWithValue($scope.filters)) {
            $scope.localConfig.localData = $filter('filter')($scope.localConfig.localData, $scope.filters);
          }

          itemsObject = $scope.localConfig.localData;
          params = {
            pageNumber: page,
            pageSize: (!$attrs.disablePaging) ? $scope.items.paging.pageSize : itemsObject.length,
            sortKey: $scope.localConfig.predicate,
            sortDirection: $scope.localConfig.reverse,
            localData: itemsObject
          };

          var response = adLoadLocalPage(params);
          $scope.items.list = response.items;
          $scope.items.allItems = response.allItems;
          $scope.items.paging.currentPage = response.currentPage;
          $scope.items.paging.totalPages = response.totalPages;
          $scope.localConfig.pagingArray = response.pagingArray;

          $scope.$emit('adTableLite:pageChanged', $scope.items.paging);
        }, 100);

        $scope.loadNextPage = function () {
          if ($scope.items.paging.currentPage + 1 <= $scope.items.paging.totalPages) {
            $scope.loadPage($scope.items.paging.currentPage + 1);
          }
        };

        $scope.loadPreviousPage = function () {
          if ($scope.items.paging.currentPage - 1 > 0) {
            $scope.loadPage($scope.items.paging.currentPage - 1);
          }
        };

        $scope.loadLastPage = function () {
          if (!$scope.localConfig.disablePaging) {
            $scope.loadPage($scope.items.paging.totalPages);
          }
        };

        $scope.pageSizeChanged = function (size) {
          $scope.items.paging.pageSize = size;
          $scope.loadPage(1);
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

        $scope.unSortTable = function () {
          $scope.localConfig.reverse = undefined;
          $scope.localConfig.predicate = undefined;
        };

        $scope.collapseAll = function () {
          $scope.localConfig.expandedItems.length = 0;
        };

        $scope.onDragStart = function(data, dragElement) {
          $scope.localConfig.expandedItems.length = 0;
          dragElement = dragElement.el;
          var parent = dragElement.parent();
          placeHolder = $('<tr id="row-phldr"><td colspan=' + dragElement.find('td').length + '>&nbsp;</td></tr>');
          initialPos = dragElement.index() + (($scope.items.paging.currentPage - 1) *
            $scope.items.paging.pageSize);
          if (!placeHolderInDom) {
            if (dragElement[0] !== parent.children().last()[0]) {
              dragElement.next().before(placeHolder);
              placeHolderInDom = true;
            } else {
              parent.append(placeHolder);
              placeHolderInDom = true;
            }
          }
        };

        $scope.onDragEnd = function() {
          $('#row-phldr').remove();
          placeHolderInDom = false;
        };

        $scope.onDragOver = function(data, dragElement, dropElement) {
          if (placeHolder) {
            // Restricts valid drag to current table instance
            moveElementNode(placeHolder, dropElement.el, dragElement.el);
          }
        };

        $scope.onDropEnd = function(data, dragElement) {
          var endPos;
          dragElement = dragElement.el;
          if (placeHolder) {
            // Restricts drop to current table instance
            if (placeHolder.next()[0]) {
              placeHolder.next().before(dragElement);
            } else if (placeHolder.prev()[0]) {
              placeHolder.prev().after(dragElement);
            }

            $('#row-phldr').remove();
            placeHolderInDom = false;

            validDrop = true;
            endPos = dragElement.index() + (($scope.items.paging.currentPage - 1) *
              $scope.items.paging.pageSize);
            adStrapUtils.moveItemInList(initialPos, endPos, $scope.localConfig.localData);
            if ($scope.localConfig.dragChange) {
              $scope.localConfig.dragChange(initialPos, endPos, data);
            }
            $scope.unSortTable();
            $scope.loadPage($scope.items.paging.currentPage);
          }
        };

        $scope.onNextPageButtonOver = function(data, dragElement, dropElement) {
          if (dropElement.el.attr('disabled') !== 'disabled') {
            pageButtonElement = dropElement.el;
            pageButtonElement.parent().addClass('active');
          }
        };

        $scope.onNextPageButtonLeave = function(data, dragElement, dropElement) {
          if (pageButtonElement && pageButtonElement === dropElement.el) {
            pageButtonElement.parent().removeClass('active');
            pageButtonElement = null;
          }
        };

        $scope.onNextPageButtonDrop = function(data, dragElement) {
          var endPos;
          if (pageButtonElement) {
            validDrop = true;
            if (pageButtonElement.attr('id') === 'btnPrev') {
              endPos = ($scope.items.paging.pageSize * ($scope.items.paging.currentPage - 1));
            }
            if (pageButtonElement.attr('id') === 'btnNext') {
              endPos = $scope.items.paging.pageSize * $scope.items.paging.currentPage;
            }
            adStrapUtils.moveItemInList(initialPos, endPos, $scope.localConfig.localData);
            $scope.loadPage($scope.items.paging.currentPage);

            $('#row-phldr').remove();
            placeHolderInDom = false;

            dragElement.el.remove();
            if ($scope.localConfig.dragChange) {
              $scope.localConfig.dragChange(initialPos, endPos, data);
            }
            pageButtonElement.parent().removeClass('active');
            pageButtonElement = null;
          }
        };

        $scope.getRowClass = function (item, index) {
          var rowClass = '';
          rowClass += ($attrs.selectedItems &&
            adStrapUtils.itemExistsInList(item, $scope.selectedItems)) ? 'ad-selected' : '';
          if ($attrs.rowClassProvider) {
            rowClass += ' ' + $scope.$eval($attrs.rowClassProvider)(item, index);
          }
          return rowClass;
        };

        $scope.toggle = function (event, index, item) {
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

        // ---------- set watchers ---------- //
        watchers.push(
          $scope.$watch($attrs.localDataSource, function () {
            $scope.loadPage($scope.items.paging.currentPage);
          })
        );
        watchers.push(
          $scope.$watch($attrs.localDataSource + '.length', function () {
            $scope.loadPage($scope.items.paging.currentPage);
          })
        );
        watchers.push(
          $scope.$watchCollection($attrs.columnDefinition, function () {
            $scope.columnDefinition = $scope.$eval($attrs.columnDefinition);
            $scope.visibleColumnDefinition = $filter('filter')($scope.columnDefinition, $scope.columnVisible);
          })
        );
        watchers.push(
          $scope.$watch($attrs.searchText, function() {
            $scope.searchText = $scope.$eval($attrs.searchText);
            $scope.loadPage(1);
          })
        );

        if ($attrs.enableColumnSearch) {
          var loadFilterPage = adDebounce(function() {
            $scope.loadPage(1);
          }, Number($attrs.columnSearchDebounce) || 400);
          watchers.push($scope.$watch('filters', function () {
            loadFilterPage();
          }, true));
        }

        // ---------- disable watchers ---------- //
        $scope.$on('$destroy', function () {
          watchers.forEach(function (watcher) {
            watcher();
          });
        });
      }

      return {
        restrict: 'E',
        controller: ['$scope', '$attrs', controllerFunction],
        templateUrl: 'tablelite/tablelite.tpl.html',
        scope: true
      };
    }]);
