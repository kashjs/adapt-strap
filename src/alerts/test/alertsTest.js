
describe('adAlerts component', function() {
  var controller, $timeout, $scope;

  beforeEach(function() {
    module('adaptv.adaptStrapDocs');
  });

  beforeEach(inject(function(_$timeout_) {
    $timeout = _$timeout_;
  }));

  it('should setup correct configuration', inject(function($rootScope, $controller, $compile) {
    controller = $controller('alertCtrl', {
      $scope: $rootScope
    });

    $compile('<ad-alerts timeout="timeoutValue"></ad-alerts>')($rootScope); 
    expect($rootScope.timeoutValue).toEqual('2000')
  }));
});
