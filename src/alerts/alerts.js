angular.module('adaptv.adaptStrap.alerts', [])
  .directive('adAlerts', [function() {
    'use strict';
    function controllerFunction($scope, $attrs, $timeout, $adConfig, adAlerts) {
      $scope.iconMap = {
        'info': $adConfig.iconClasses.alertInfoSign,
        'success': $adConfig.iconClasses.alertSuccessSign,
        'warning': $adConfig.iconClasses.alertWarningSign,
        'danger': $adConfig.iconClasses.alertDangerSign
      };

      var timeout = $scope.timeout && !Number(timeout).isNAN ? $scope.timeout : 0;
      var timeoutPromise;

      $scope.close = function() {
        adAlerts.clear();
        if (timeoutPromise) {
          $timeout.cancel(timeoutPromise);
        }
      };

      $scope.settings = adAlerts.settings;

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
      controller: ['$scope', '$attrs', '$timeout', '$adConfig', 'adAlerts', controllerFunction]
    };
  }]);
