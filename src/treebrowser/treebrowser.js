'use strict';

angular.module('adaptv.adaptStrap.treebrowser', [])

/**
 * adTreeBrowser directive populates a tree dataStructure
 */
  .directive('adTreeBrowser', ['$compile', '$http', '$adConfig', '$templateCache',
    function ($compile, $http, $adConfig, $templateCache) {
      function _link (scope, element, attrs) {
        // We do the name spacing so the if there are multiple ad-tree-browser on the scope,
        // they don't fight with each other.
        scope[attrs.treeName] = {
          toggle: function (event, item) {
            var toggleCallback;
            event.stopPropagation();
            toggleCallback = scope.$eval(attrs.toggleCallback);
            if (toggleCallback) {
              toggleCallback(item);
            } else {
              item._ad_expanded = !item._ad_expanded;
            }
          },
          hasChildren: function (item) {
            var hasChildren = scope.$eval(attrs.hasChildren),
              found = item[attrs.childNode] && item[attrs.childNode].length > 0;
            if (hasChildren) {
              found = hasChildren(item);
            }
            return found;
          },
          localConfig: {
            showHeader: (attrs.nodeHeaderUrl) ? true : false
          }
        };

        // ---------- Local data ---------- //
        var treeName = attrs.treeName || '',
          nodeTemplateUrl = attrs.nodeTemplateUrl || '',
          nodeHeaderUrl = attrs.nodeHeaderUrl || '',
          childrenPadding = attrs.childrenPadding || 15,
          template = '',
          populateMainTemplate = function (nodeTemplate, nodeHeaderTemplate) {
            var data = $templateCache.get('treebrowser/treebrowser.tpl.html');
            template = data.replace(/%=treeName%/g, treeName).
              replace(/%=treeRootName%/g, attrs.treeRoot).
              replace(/%=bordered%/g, attrs.bordered).
              replace(/%=icon-expand%/g, $adConfig.iconClasses.expand).
              replace(/%=icon-collapse%/g, $adConfig.iconClasses.collapse).
              replace(/%=icon-loadingSpinner%/g, $adConfig.iconClasses.loadingSpinner).
              replace(/%=childNodeName%/g, attrs.childNode).
              replace(/%=childrenPadding%/g, childrenPadding).
              replace(/%=rowNgClass%/g, attrs.rowNgClass || '').
              replace(/%=nodeTemplate%/g, nodeTemplate).
              replace(/%=nodeHeaderTemplate%/g, nodeHeaderTemplate || '');
            element.empty();
            element.append($compile(template)(scope));
          };

        // ---------- initialization ---------- //
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

      return {
        restrict: 'E',
        link: _link
      };
    }]);
