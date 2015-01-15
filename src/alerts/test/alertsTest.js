<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
describe('adAlerts component', function() {
=======
describe('alerts component', function() {
>>>>>>> e8c1a0e...  New alert component
=======
describe('adAlerts component', function() {
>>>>>>> 7addba2... alerts component changes
=======
describe('adAlerts component', function() {
>>>>>>> 7addba2... alerts component changes
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
