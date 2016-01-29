var tableLitePage = require('./tablelite.po');
tableLitePage = new tableLitePage();
describe('E2E Table Lite', function() {
  it('rows should be selectable', function() {
    tableLitePage.load();
    expect(tableLitePage.selectedItems.getText()).toContain('1');
    tableLitePage.selectAllCheckbox.click();
    expect(tableLitePage.selectedItems.getText()).toContain('12');
  });

  it('should search correctly', function () {
    tableLitePage.nameInput.sendKeys('BMW');
    tableLitePage.getSearchResultRows().then(function (resultRows) {
      expect(resultRows.length).toBe(2);
    });
  });
});
