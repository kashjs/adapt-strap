var alertsPage = function() {
  this.infoAlertButton = $('#infoBut');
  this.messageContainer = $('ad-alerts h4 strong');
  this.load = function () {
    browser.get('/##alerts');
    browser.sleep(1000);
    browser.executeScript(function () {
      arguments[0].scrollIntoView();
    }, browser.findElement(by.id('alerts')));
  };
};

module.exports = alertsPage;
