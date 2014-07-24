'use strict';

angular.module('adaptv.adaptStrap.treebrowser',[])

    .provider('$treebrowser', function() {
        var defaults = this.defaults = {
            expandIconClass: 'glyphicon glyphicon-plus-sign',
            collapseIconClass: 'glyphicon glyphicon-minus-sign',
            loadingIconClass: 'glyphicon glyphicon-refresh ad-spin'
        };
        this.$get = function() {
            return {
                settings: defaults
            };
        };
    })

/**
 * treeBrowser directive populates a tree dataStructure
 * In your tree-browser tag you need to provide following attributes
 * tree-name - a string name of the tree. To support multiple trees
 * tree-root - root path to the tree data structure example: audienceTargeting.segmentTree
 * child-node - name of the object that contains children nodes example child-node="children"
 * node-template-url - template to render the node properties
 *                     take a look at for usage "views/templates/directives/treeBrowser/segment.html"
 * node-header-url - template similar to node template, but it has the header tags. (EX: id, name, status)
 * children-padding - padding from parent. Default is 15px.
 * has-children - function that checks the availability of the children.
 *                this is only needed if you are doing lazy loading. if false (row is a leaf),
 *                the toggle arrow will not be shown.
 * row-ng-class - ng-class expression that will be applied to each row.
 * toggle-callback - This function is to lazy load the tree levels.
 *                   Provide the path to toggle function. If you do provide this, the tree item will be passed to this
 *                   function every time some one toggles a tree level. In this case, you need to set the _expanded
 *                   property to true or false. You can also set loading property to true or false on the item.
 *                   If you set _loading to true, the ui will show the _loading icon on that tree level.
 *
 * treeBrowser will adapt the parent element's height and width.
 *
 * For example usage take a look at segments-browse-all.html file.
 */

    .directive('adTreeBrowser', ['$compile', '$http', '$treebrowser', '$templateCache', function ($compile, $http, $treebrowser, $templateCache) {
        'use strict';
        return {
            link: function (scope, element, attrs) {
                var treeName = attrs.treeName || '',
                    nodeTemplateUrl = attrs.nodeTemplateUrl || '',
                    nodeHeaderUrl = attrs.nodeHeaderUrl || '',
                    childrenPadding = attrs.childrenPadding || 15,
                    template = '',
                    populateMainTemplate = function (nodeTemplate, nodeHeaderTemplate) {
                        var data = $templateCache.get('treebrowser/treebrowser.tpl.html')
                        template = data.replace(/%=treeName%/g, treeName).
                            replace(/%=treeRootName%/g, attrs.treeRoot).
                            replace(/%=bordered%/g, attrs.bordered).
                            replace(/%=expandIconClass%/g, $treebrowser.settings.expandIconClass).
                            replace(/%=collapseIconClass%/g, $treebrowser.settings.collapseIconClass).
                            replace(/%=loadingIconClass%/g, $treebrowser.settings.loadingIconClass).
                            replace(/%=childNodeName%/g, attrs.childNode).
                            replace(/%=childrenPadding%/g, childrenPadding).
                            replace(/%=rowNgClass%/g, attrs.rowNgClass || '').
                            replace(/%=nodeTemplate%/g, nodeTemplate).
                            replace(/%=nodeHeaderTemplate%/g, nodeHeaderTemplate || '');
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
                        var hasChildren = scope.$eval(attrs.hasChildren),
                            found = item[attrs.childNode] && item[attrs.childNode].length > 0;
                        if (hasChildren) {
                            found = hasChildren(item);
                        }
                        return found;
                    },
                    showHeader: (nodeHeaderUrl !== '') ? true : false
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
    }]);
