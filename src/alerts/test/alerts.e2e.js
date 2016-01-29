var alertPage = require('./alerts.po');
alertPage = new alertPage();

describe('E2E Alerts', function() {
  it('should show correct alert with message', function() {
    alertPage.load()
    alertPage.infoAlertButton.click();
    expect(alertPage.messageContainer.getText()).toContain('Info!');
  });
});
