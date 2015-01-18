angular.module('adaptv.adaptStrapDocs')
  .controller('alertCtrl', ['$scope', 'alerts', function($scope, alerts) {
    $scope.timeoutValue = '2000';

    $scope.showInfo = function() {
      alerts.info('Info!', 'This is important information.');
    };

    $scope.showWarning = function() {
      alerts.warning('Warning!', 'This is a warning.');
    };

    $scope.showSuccess = function() {
      alerts.success('Success!', 'Success message');
    };

    $scope.showError = function() {
      alerts.error('Error!', 'This is an error.');
    };

  }]);
