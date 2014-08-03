angular.module('adaptv.adaptStrap', [
  'adaptv.adaptStrap.utils',
  'adaptv.adaptStrap.treebrowser',
  'adaptv.adaptStrap.tablelite',
  'adaptv.adaptStrap.tableajax',
  'adaptv.adaptStrap.loadingindicator'
])
  .provider('$adConfig', function () {
    var iconClasses = this.iconClasses = {
        expand: 'glyphicon glyphicon-plus-sign',
        collapse: 'glyphicon glyphicon-minus-sign',
        loadingSpinner: 'glyphicon glyphicon-refresh ad-spin',
        firstArrow: 'glyphicon glyphicon-fast-backward',
        backArrow: 'glyphicon glyphicon-backward',
        nextArrow: 'glyphicon glyphicon-forward',
        lastArrow: 'glyphicon glyphicon-fast-forward',
        upArrow: 'glyphicon glyphicon-chevron-up',
        downArrow: 'glyphicon glyphicon-chevron-down',
        upDownArrow: 'glyphicon glyphicon-resize-vertical'
      },
      paging = this.paging = {
        request: {
          start: 'skip',
          pageSize: 'limit',
          page: 'page',
          sortField: 'sort',
          sortDirection: 'sort_dir',
          sortAscValue: 'asc',
          sortDescValue: 'desc'
        },
        response: {
          itemsLocation: 'data',
          totalItems: 'pagination.totalCount'
        }
      };
    this.$get = function () {
      return {
        iconClasses: iconClasses,
        paging: paging
      };
    };
  });
