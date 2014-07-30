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
        loadingSpinner: 'glyphicon glyphicon-refresh ad-spin'
      },
      paging = this.paging = {
        request: {
          start: 'skip',
          pageSize: 'limit',
          page: 'page'
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
