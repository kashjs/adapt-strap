/**
 * adapt-strap
 * @version v0.0.5 - 2014-07-27
 * @link https://github.com/Adaptv/adapt-strap
 * @author Kashyap Patel (kashyap@adap.tv)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';
angular.module('adaptv.adaptStrap.tablelite').run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('tablelite/tablelite.tpl.html', '<div class="ad-table-lite-container"><table class="%=tableClasses%"><tr><th data-ng-repeat="definition in %=columnDefinition%">{{ definition.columnHeaderDisplayName }}</th></tr><tr data-ng-repeat="item in %=tableName%.items.list"><td data-ng-repeat="definition in %=columnDefinition%"><div ng-if="definition.templateUrl"><ng-include src="definition.templateUrl"></ng-include></div><div ng-if="!definition.templateUrl">{{ %=tableName%.applyFilter(item[definition.displayProperty], definition.cellFilter) }}</div></td></tr></table><div class="row"><div class="col-md-6 col-sm-6"><ul class="%=paginationClasses% pull-left"><li><a href="" type="button" ng-click="%=tableName%.loadPreviousPage()" ng-disabled="%=tableName%.items.paging.currentPage == 1">&laquo;</a></li><li ng-repeat="page in %=tableName%.localConfig.pagingArray" ng-class="{active: %=tableName%.items.paging.currentPage == page}"><a href="" type="button" ng-click="%=tableName%.loadPage(page)">{{ page }}</a></li><li><a href="" type="button" ng-click="%=tableName%.loadNextPage()" ng-disabled="%=tableName%.items.paging.currentPage == %=tableName%.items.paging.totalPages">&raquo;</a></li></ul></div><div class="col-md-6 col-sm-6"><ul class="%=paginationClasses% pull-right"><li ng-repeat="size in %=tableName%.items.paging.pageSizes" ng-class="{active: %=tableName%.items.paging.pageSize == size}"><a href="" type="button" ng-click="%=tableName%.pageSizeChanged(size)">{{ size }}</a></li></ul></div></div></div>');
  }
]);