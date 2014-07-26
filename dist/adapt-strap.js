/**
 * adapt-strap
 * @version v0.0.3 - 2014-07-26
 * @link https://github.com/Adaptv/adapt-strap
 * @author Kashyap Patel (kashyap@adap.tv)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function(window, document, undefined) {
'use strict';
// Source: module.js
angular.module('adaptv.adaptStrap', [
  'adaptv.adaptStrap.treebrowser',
  'adaptv.adaptStrap.tablelite',
  'adaptv.adaptStrap.utils'
]);

// Source: tablelite.js
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

// Source: treebrowser.js
angular.module('adaptv.adaptStrap.treebrowser', []).provider('$treebrowser', function () {
  var defaults = this.defaults = {
      expandIconClass: 'glyphicon glyphicon-plus-sign',
      collapseIconClass: 'glyphicon glyphicon-minus-sign',
      loadingIconClass: 'glyphicon glyphicon-refresh ad-spin'
    };
  this.$get = function () {
    return { settings: defaults };
  };
}).directive('adTreeBrowser', [
  '$compile',
  '$http',
  '$treebrowser',
  '$templateCache',
  function ($compile, $http, $treebrowser, $templateCache) {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        var treeName = attrs.treeName || '', nodeTemplateUrl = attrs.nodeTemplateUrl || '', nodeHeaderUrl = attrs.nodeHeaderUrl || '', childrenPadding = attrs.childrenPadding || 15, template = '', populateMainTemplate = function (nodeTemplate, nodeHeaderTemplate) {
            var data = $templateCache.get('treebrowser/treebrowser.tpl.html');
            template = data.replace(/%=treeName%/g, treeName).replace(/%=treeRootName%/g, attrs.treeRoot).replace(/%=bordered%/g, attrs.bordered).replace(/%=expandIconClass%/g, attrs.expandIconClass || $treebrowser.settings.expandIconClass).replace(/%=collapseIconClass%/g, attrs.collapseIconClass || $treebrowser.settings.collapseIconClass).replace(/%=loadingIconClass%/g, attrs.loadingIconClass || $treebrowser.settings.loadingIconClass).replace(/%=childNodeName%/g, attrs.childNode).replace(/%=childrenPadding%/g, childrenPadding).replace(/%=rowNgClass%/g, attrs.rowNgClass || '').replace(/%=nodeTemplate%/g, nodeTemplate).replace(/%=nodeHeaderTemplate%/g, nodeHeaderTemplate || '');
            element.empty();
            element.append($compile(template)(scope));
          };
        scope[treeName + 'TreeBrowser'] = {
          toggle: function (event, item) {
            var toggleCallback;
            event.stopPropagation();
            toggleCallback = scope.$eval(attrs.toggleCallback);
            if (toggleCallback) {
              toggleCallback(item);
            } else {
              item._expanded = !item._expanded;
            }
          },
          hasChildren: function (item) {
            var hasChildren = scope.$eval(attrs.hasChildren), found = item[attrs.childNode] && item[attrs.childNode].length > 0;
            if (hasChildren) {
              found = hasChildren(item);
            }
            return found;
          },
          showHeader: nodeHeaderUrl !== '' ? true : false
        };
        if (nodeTemplateUrl !== '') {
          // Getting the template from nodeTemplateUrl
          $http.get(nodeTemplateUrl).success(function (nodeTemplate) {
            if (nodeHeaderUrl !== '') {
              $http.get(nodeHeaderUrl).success(function (headerTemplate) {
                populateMainTemplate(nodeTemplate, headerTemplate);
              });
            } else {
              populateMainTemplate(nodeTemplate, '');
            }
          });
        } else {
          populateMainTemplate('<span>{{ item.name || "" }}</span>');
        }
      }
    };
  }
]);

// Source: utils.js
angular.module('adaptv.adaptStrap.utils', []).factory('adStrapUtils', [
  '$filter',
  function ($filter) {
    return {
      applyFilter: function (value, filter) {
        var parts, filterOptions;
        if (filter) {
          parts = filter.split(':');
          filterOptions = parts[1];
          if (filterOptions) {
            value = $filter(parts[0])(value, filterOptions);
          } else {
            value = $filter(parts[0])(value);
          }
        }
        return value;
      }
    };
  }
]);

})(window, document);
