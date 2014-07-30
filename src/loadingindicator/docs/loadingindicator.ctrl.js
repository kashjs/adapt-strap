angular.module('adaptv.adaptStrapDocs')
  .controller('loadingIndicatorCtrl', ['$scope', function ($scope) {
    $scope.showLoadingIcon = false;
    $scope.showSimpleIcon = true;
  }]);
