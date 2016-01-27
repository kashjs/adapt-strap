describe('E2E Alerts', function() {
  it('should show correct alert with message', function() {
    browser.get('/##alerts');
    var infoAlertButton = $('#infoBut');
    var messageContainer = $('ad-alerts h4 strong');
    infoAlertButton.click();
    expect(messageContainer.getText()).toContain('Info!');
  });
});
