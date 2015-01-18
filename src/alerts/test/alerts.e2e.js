describe('E2E Alerts', function() {
  var page = {};
  beforeEach(function() {
    browser.get('/');
  });

  it('should show correct alert with message', function() {
    var infoAlertButton = $('#infoBut');
    var messageContainer = $('ad-alerts > h4 > strong') 
    infoAlertButton.click();
    expect(messageContainer.getText()).toContain('Info!')
  });

});
