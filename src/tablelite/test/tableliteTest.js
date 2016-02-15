describe('tablelite component', function () {
  var rootScope, compile, controller;

  beforeEach(function () {
    module('adaptv.adaptStrapDocs');
  });
  beforeEach(function () {
    module('dir-templates');
  });
  beforeEach(inject(function ($rootScope, $controller, $compile) {
    rootScope = $rootScope;
    controller = $controller;
    compile = $compile;
  }));

  function compileTable(controllerScope) {
    controller('tableliteCtrl', {
      $scope: controllerScope
    });
    var element = compile(
      '<ad-table-lite ' +
      'table-name="carsForSale"' +
      'column-definition="carsTableColumnDefinition"' +
      'local-data-source="models.carsForSale"' +
      'page-sizes="[7, 20]"' +
      'pagination-btn-group-classes="btn-group btn-group-sm"' +
      'table-classes="table table-bordered">' +
      '</ad-table-lite>'
    )(controllerScope.$new());
    controllerScope.$digest();
    return element;
  }

  it('should initialize with correct configuration', inject(function () {
    var controllerScope = rootScope.$new();
    compileTable(controllerScope);
    expect(controllerScope.models).toBeDefined();
    expect(controllerScope.models.selectedCars).toBeDefined();
    expect(controllerScope.models.changeInfo).toBeDefined();
    expect(controllerScope.carsTableColumnDefinition).toBeDefined();
    expect(controllerScope.onDragChange).toBeDefined();
    expect(controllerScope.onStateChange).toBeDefined();
    expect(controllerScope.buyCar).toBeDefined();
    expect(controllerScope.models.carsForSale.length).toEqual(12);
    expect(controllerScope.models.selectedCars.length).toEqual(1);
  }));

  it('external actions should function correctly', inject(function () {
    var controllerScope = rootScope.$new();
    var directiveScope = compileTable(controllerScope).scope();

    //expand first row
    directiveScope.localConfig.expandedItems[0] = 0;

    // externally collapse first row
    controllerScope.expandCollapseRow(0);
    expect(directiveScope.localConfig.expandedItems.length).toEqual(0);
  }));
});