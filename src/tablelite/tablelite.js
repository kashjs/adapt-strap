angular.module('adaptv.adaptStrap.tablelite', ['adaptv.adaptStrap.utils'])
/**
 * Use this directive if you need to render a simple table with local data source.
 */
  .directive('adTableLite', [
    '$parse', '$http', '$compile', '$filter', '$templateCache',
    '$adConfig', 'adStrapUtils', 'adDebounce', 'adLoadLocalPage',
    function ($parse, $http, $compile, $filter, $templateCache, $adConfig, adStrapUtils, adDebounce, adLoadLocalPage) {
      'use strict';
      function _link(scope, element, attrs) {
        // We do the name spacing so the if there are multiple ad-table-lite on the scope,
        // they don't fight with each other.
        scope[attrs.tableName] = {
          items: {
            list: undefined,
            allItems: undefined,
            paging: {
              currentPage: 1,
              totalPages: undefined,
              pageSize: undefined,
              pageSizes: $parse(attrs.pageSizes)() || [10, 25, 50]
            }
          },
          localConfig: {
            localData: adStrapUtils.parse(scope.$eval(attrs.localDataSource)),
            pagingArray: [],
            selectable: attrs.selectedItems ? true : false,
            draggable: attrs.draggable ? true : false,
            dragChange: scope.$eval(attrs.onDragChange),
            showPaging: $parse(attrs.disablePaging)() ? false : true,
            tableMaxHeight: attrs.tableMaxHeight
          },
          selectedItems: scope.$eval(attrs.selectedItems),
          applyFilter: adStrapUtils.applyFilter,
          isSelected: adStrapUtils.itemExistsInList,
          addRemoveItem: adStrapUtils.addRemoveItemFromList,
          addRemoveAll: adStrapUtils.addRemoveItemsFromList,
          allSelected: adStrapUtils.itemsExistInList,
          readProperty: adStrapUtils.getObjectProperty
        };

        // ---------- Local data ---------- //
        var tableModels = scope[attrs.tableName],
          mainTemplate = $templateCache.get('tablelite/tablelite.tpl.html'),
          placeHolder = null,
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

        tableModels.items.paging.pageSize = tableModels.items.paging.pageSizes[0];

        // ---------- ui handlers ---------- //
        tableModels.loadPage = adDebounce(function (page) {
          var itemsObject = tableModels.localConfig.localData = adStrapUtils.parse(scope.$eval(attrs.localDataSource)),
              params;
          params = {
            pageNumber: page,
            pageSize: (tableModels.localConfig.showPaging) ? tableModels.items.paging.pageSize : itemsObject.length,
            sortKey: tableModels.localConfig.predicate,
            sortDirection: tableModels.localConfig.reverse,
            localData: itemsObject
          };

          var response = adLoadLocalPage(params);
          tableModels.items.list = response.items;
          tableModels.items.allItems = response.allItems;
          tableModels.items.paging.currentPage = response.currentPage;
          tableModels.items.paging.totalPages = response.totalPages;
          tableModels.localConfig.pagingArray = response.pagingArray;
        }, 100);

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
          if (column.sortKey) {
            if (column.sortKey !== tableModels.localConfig.predicate) {
              tableModels.localConfig.predicate = column.sortKey;
              tableModels.localConfig.reverse = true;
            } else {
              if (tableModels.localConfig.reverse === true) {
                tableModels.localConfig.reverse = false;
              } else {
                tableModels.localConfig.reverse = undefined;
                tableModels.localConfig.predicate = undefined;
              }
            }
            tableModels.loadPage(tableModels.items.paging.currentPage);
          }
        };

        tableModels.onDragStart = function(data, dragElement) {
          var parent = dragElement.parent();
          placeHolder = $('<tr><td colspan=' + dragElement.find('td').length + '>&nbsp;</td></tr>');
          initialPos = dragElement.index() + ((tableModels.items.paging.currentPage - 1) *
              tableModels.items.paging.pageSize) - 1;
          if (dragElement[0] !== parent.children().last()[0]) {
            dragElement.next().before(placeHolder);
          } else {
            parent.append(placeHolder);
          }
        };

        tableModels.onDragEnd = function() {
          placeHolder.remove();
        };

        tableModels.onDragOver = function(data, dragElement, dropElement) {
          if (placeHolder) {
            // Restricts valid drag to current table instance
            moveElementNode(placeHolder, dropElement, dragElement);
          }
        };

        tableModels.onDropEnd = function(data, dragElement) {
          var endPos;
          if (placeHolder) {
            // Restricts drop to current table instance
            if (placeHolder.next()[0]) {
              placeHolder.next().before(dragElement);
            } else if (placeHolder.prev()[0]) {
              placeHolder.prev().after(dragElement);
            }
            placeHolder.remove();
            validDrop = true;
            endPos = dragElement.index() + ((tableModels.items.paging.currentPage - 1) *
              tableModels.items.paging.pageSize) - 1;
            adStrapUtils.moveItemInList(initialPos, endPos, tableModels.localConfig.localData);

            if (tableModels.localConfig.dragChange) {
              tableModels.localConfig.dragChange(initialPos, endPos, data);
            }
          }
          if (pageButtonElement) {
            pageButtonElement.removeClass('btn-primary');
            pageButtonElement = null;
          }
        };

        tableModels.onNextPageButtonOver = function(data, dragElement, dropElement) {
          if (pageButtonElement) {
            pageButtonElement.removeClass('btn-primary');
            pageButtonElement = null;
          }
          if (dropElement.attr('disabled') !== 'disabled') {
            pageButtonElement = dropElement;
            pageButtonElement.addClass('btn-primary');
          }
        };

        tableModels.onNextPageButtonDrop = function(data, dragElement) {
          var endPos;
          if (pageButtonElement) {
            validDrop = true;
            if (pageButtonElement.attr('id') === 'btnPrev') {
              endPos = (tableModels.items.paging.pageSize * (tableModels.items.paging.currentPage - 1)) - 1;
            }
            if (pageButtonElement.attr('id') === 'btnNext') {
              endPos = tableModels.items.paging.pageSize * tableModels.items.paging.currentPage;
            }
            adStrapUtils.moveItemInList(initialPos, endPos, tableModels.localConfig.localData);
            placeHolder.remove();
            dragElement.remove();
            if (tableModels.localConfig.dragChange) {
              tableModels.localConfig.dragChange(initialPos, endPos, data);
            }
            pageButtonElement.removeClass('btn-primary');
            pageButtonElement = null;
          }
        };

        // ---------- initialization and event listeners ---------- //
        //We do the compile after injecting the name spacing into the template.
        tableModels.loadPage(1);
        attrs.tableClasses = attrs.tableClasses || 'table';
        attrs.paginationBtnGroupClasses = attrs.paginationBtnGroupClasses || 'btn-group btn-group-sm';
        mainTemplate = mainTemplate.
          replace(/%=tableName%/g, attrs.tableName).
          replace(/%=columnDefinition%/g, attrs.columnDefinition).
          replace(/%=paginationBtnGroupClasses%/g, attrs.paginationBtnGroupClasses).
          replace(/%=tableClasses%/g, attrs.tableClasses).
          replace(/%=icon-firstPage%/g, $adConfig.iconClasses.firstPage).
          replace(/%=icon-previousPage%/g, $adConfig.iconClasses.previousPage).
          replace(/%=icon-nextPage%/g, $adConfig.iconClasses.nextPage).
          replace(/%=icon-lastPage%/g, $adConfig.iconClasses.lastPage).
          replace(/%=icon-sortAscending%/g, $adConfig.iconClasses.sortAscending).
          replace(/%=icon-sortDescending%/g, $adConfig.iconClasses.sortDescending).
          replace(/%=icon-sortable%/g, $adConfig.iconClasses.sortable).
          replace(/%=icon-draggable%/g, $adConfig.iconClasses.draggable);
        element.empty();
        element.append($compile(mainTemplate)(scope));

        // ---------- set watchers ---------- //
        watchers.push(
          scope.$watch(attrs.localDataSource, function () {
            tableModels.loadPage(tableModels.items.paging.currentPage);
          })
        );
        watchers.push(
          scope.$watch(attrs.localDataSource + '.length', function () {
            tableModels.loadPage(tableModels.items.paging.currentPage);
          })
        );

        // ---------- disable watchers ---------- //
        scope.$on('$destroy', function () {
          watchers.forEach(function (watcher) {
            watcher();
          });
        });
      }

      return {
        restrict: 'E',
        link: _link
      };
    }]);
