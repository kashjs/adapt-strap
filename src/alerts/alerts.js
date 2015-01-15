angular.module('adaptv.adaptStrap.alerts', [])
  .directive('adAlerts', [function() {
    'use strict';
<<<<<<< HEAD
    function controllerFunction($scope, $attrs, $timeout, $adConfig, alerts) {
      $scope.iconMap = {
        'info': $adConfig.iconClasses.alertInfoSign,
        'success': $adConfig.iconClasses.alertSuccessSign,
        'warning': $adConfig.iconClasses.alertWarningSign,
        'danger': $adConfig.iconClasses.alertDangerSign
=======
    function controllerFunction($scope, $attrs, $timeout, alerts) {
      $scope.iconMap = {
        'info': 'info-sign',
        'success': 'ok',
        'warning': 'warning-sign',
        'danger': 'exclamation-sign'
>>>>>>> e8c1a0e...  New alert component
      };

      var timeout = $scope.timeout && !Number(timeout).isNAN ? $scope.timeout : 0;
      var timeoutPromise;

      $scope.close = function() {
        alerts.clear();
        if (timeoutPromise) {
          $timeout.cancel(timeoutPromise);
        }
      };

      $scope.settings = alerts.settings;

      if (timeout !== 0) {
        $scope.$watch('settings.type', function(type) {
          if (type !== '') {
            if (timeoutPromise) {
              $timeout.cancel(timeoutPromise);
            }
            timeoutPromise = $timeout($scope.close, timeout);
          }
        });
      }
    }
    return {
      restrict: 'AE',
      scope: {
        timeout: '=' //ms
      },
      templateUrl: 'alerts/alerts.tpl.html',
<<<<<<< HEAD
      controller: ['$scope', '$attrs', '$timeout', '$adConfig', 'alerts', controllerFunction]
=======
      controller: ['$scope', '$attrs', '$timeout', 'alerts', controllerFunction]
>>>>>>> e8c1a0e...  New alert component
    };
  }]);
