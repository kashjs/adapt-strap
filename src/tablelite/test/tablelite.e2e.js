describe('E2E Table Lite', function() {
  var page = {};

  it('rows should be selectable', function() {
    browser.get('/##tablelite');
    var selectedItems = element(by.binding('models.selectedCars.length')),
        selectAllCheckbox = $('#tablelite th input[type="checkbox"]');
    expect(selectedItems.getText()).toContain('1');
    selectAllCheckbox.click();
    expect(selectedItems.getText()).toContain('12');
  });

  it('should search correctly', function () {
    var nameInput = $('#tableLiteSearch');
    nameInput.sendKeys('BMW');
    element.all(by.css('#tablelite .ad-table-container tbody tr')).then(function (resultRows) {
      expect(resultRows.length).toBe(2);
    });
  });
});
