'use strict';

angular.module('adaptv.adaptStrap.uipermissions', []).
  provider('adUiPermissions', function () {
    var options = this.options = {
      enabled: true,
      permissionsPrefix: '_ui_.p',
      unAuthorizedPath: '/analytics'
    };
    this.$get = ['$rootScope', '$location', '$route', function ($rootScope, $location, $route) {

      /**
       * Checks the permission for given route object
       * If the permission not found, navigates to the unAuthorized page
       * @param {Object} route - Angular route object
       */
      function checkRoutePermission (route) {
        if (route.permissions && !$rootScope.$eval(route.permissions)) {
          $location.path(options.unAuthorizedPath);
          $location.replace();
        }
      }

      if (options.enabled) {
        var nameSpace = options.permissionsPrefix.split('.');
        options.nameSpace = nameSpace;
        options[nameSpace[0]] = {};
        options[nameSpace[0]][nameSpace[1]] = false;

        $rootScope[nameSpace[0]] = options[nameSpace[0]];
        $rootScope.$on('$routeChangeStart', function (event, data) {
          checkRoutePermission(data.$$route);
        });
      }

      /**
       * populatePermissions populates ui permissions onto an isolated scope
       * We need this method to allow directives with isolated scope to be able
       * to use ui permissions in their templates. Just call this method on the
       * first line of you directive controller that uses isolated scope.
       * @param {Object} scope - the isolated scope
       */
      function populatePermissions (scope) {
        scope[options.nameSpace[0]] = options[options.nameSpace[0]];
      }

      /**
       * initiatePermissions - If the permissions were not available during app
       * bootstra, you can set them afterwords using this method
       * @param {Array} permissions - array of permission strings.
       */
      function initiatePermissions(permissions) {
        var valid = true,
            permissionsObject = {},
            route;
        permissions.forEach(function (permission) {
          if (typeof permission !== 'string') {
            valid = false;
          } else {
            permissionsObject[permission] = true;
          }
        });
        if (valid) {
          options[options.nameSpace[0]][options.nameSpace[1]] = Object.freeze(permissionsObject);
          route = $route.routes[$location.$$path];
          checkRoutePermission(route);
        }
      }

      return {
        options: options,
        populatePermissions: populatePermissions,
        initiatePermissions: initiatePermissions
      };
    }];
  });
