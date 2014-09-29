describe('tablelite component', function () {
  var controller,
    $timeout;

  beforeEach(function () {
    module('adaptv.adaptStrapDocs');
  });

  beforeEach(inject(function (_$timeout_, $httpBackend) {
    // `$timeout` before tests run
    $timeout = _$timeout_;
    $httpBackend.when('GET', 'src/tablelite/docs/buyCell.html').respond('');
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

    expect($rootScope.models).toBeDefined();
    expect($rootScope.models.selectedCars).toBeDefined();
    expect($rootScope.models.changeInfo).toBeDefined();
    expect($rootScope.carsTableColumnDefinition).toBeDefined();
    expect($rootScope.onChange).toBeDefined();
    expect($rootScope.buyCar).toBeDefined();
    expect($rootScope.models.carsForSale.length).toEqual(12);
    expect($rootScope.models.selectedCars.length).toEqual(1);
  }));
});