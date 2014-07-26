/**
 * adapt-strap
 * @version v0.0.3 - 2014-07-26
 * @link https://github.com/Adaptv/adapt-strap
 * @author Kashyap Patel (kashyap@adap.tv)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('adaptv.adaptStrap.tablelite', []).provider('$tablelite', function () {
  var defaults = this.defaults = {
      expandIconClass: 'glyphicon glyphicon-plus-sign',
      collapseIconClass: 'glyphicon glyphicon-minus-sign',
      loadingIconClass: 'glyphicon glyphicon-refresh ad-spin'
    };
  this.$get = function () {
    return { settings: defaults };
  };
}).directive('adTableLite', [
  '$q',
  '$http',
  '$compile',
  '$filter',
  '$templateCache',
  'adStrapUtils',
  function ($q, $http, $compile, $filter, $templateCache, adStrapUtils) {
    'use strict';
    function _link(scope, element, attrs) {
      // We do the name spacing so the if there are multiple adap-table-lite on the scope,
      // they don't fight with each other.
      scope[attrs.tableName] = { items: scope.$eval(attrs.localDataSource) };
      // ---------- Local data ---------- //
      var tableModels = scope[attrs.tableName], mainTemplate = $templateCache.get('tablelite/tablelite.tpl.html');
      // ---------- ui handlers ---------- //
      scope.formatValue = function (value, filter) {
        return adStrapUtils.applyFilter(value, filter);
      };
      // ---------- initialization and event listeners ---------- //
      //We do the compile after injecting the name spacing into the template.
      attrs.tableClasses = attrs.tableClasses || 'table';
      mainTemplate = mainTemplate.replace(/%=tableName%/g, attrs.tableName).replace(/%=columnDefinition%/g, attrs.columnDefinition).replace(/%=tableClasses%/g, attrs.tableClasses);
      angular.element(element).html($compile(mainTemplate)(scope));
    }
    return {
      restrict: 'E',
      link: _link
    };
  }
]);