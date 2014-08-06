/**
 * Created by languyen14 on 7/8/14.
 */
describe('tablelite component', function () {
  var controller,
    $timeout;

  beforeEach(function () {
    module('adaptv.adaptStrapDocs');
  });

  beforeEach(inject(function (_$timeout_) {
    // `$timeout` before tests run
    $timeout = _$timeout_;
  }));

  it('should initialize with correct configuration', inject(function ($rootScope, $controller, $compile) {
    controller = $controller('tableliteCtrl', {
      $scope: $rootScope
    });

    $compile(
        '<ad-table-lite ' +
        'table-name="carsForSale"' +
        'column-definition="carsTableColumnDefinition"' +
        'local-data-source="models.carsForSale"' +
        'page-sizes="[7, 20]"' +
        'pagination-btn-group-classes="btn-group btn-group-sm"' +
        'table-classes="table table-bordered">' +
        '</ad-table-lite>'
    )($rootScope);

    $timeout(function () {
      expect($rootScope.carsForSale.items.paging.currentPage).toEqual(1);
      expect($rootScope.carsForSale.items.paging.totalPages).toEqual(2);
      expect($rootScope.carsForSale.items.paging.pageSize).toEqual(7);
      expect($rootScope.carsForSale.items.list.length).toEqual(7);
    }, 1000);

    $timeout.flush();
  }));
});