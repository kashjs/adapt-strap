/**
 * adapt-strap
 * @version v0.1.2 - 2014-07-29
 * @link https://github.com/Adaptv/adapt-strap
 * @author Kashyap Patel (kashyap@adap.tv)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';
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