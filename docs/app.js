// ========== modules documentation configuration ========== //
window.adaptStrapModules = [
  {
    moduleName: 'treebrowser',
    displayName: 'Tree Browser',
    controllerName: 'treebrowserCtrl',
    docFiles: [
      'treebrowser.view.html',
      'treebrowser.ctrl.js',
      'treeNode.html',
      'treeHeader.html'
    ],
    attributeOptions: [
      {
        name: 'tree-name',
        required: true,
        type: 'String',
        default: 'NA',
        description: 'Name of the tree. Name has to be so that it' +
          ' can be a valid javascript variable name. Make sure that your scope doesn not have' +
          'a property with the same name as the tree-name'
      },
      {
        name: 'tree-root',
        required: true,
        type: 'String',
        default: 'NA',
        description: 'root path to the tree data structure ' +
          'example: <markdown>tree-root="data.root"</markdown>'
      },
      {
        name: 'child-node',
        required: true,
        type: 'String',
        default: 'NA',
        description: 'name of the object that contains children ' +
          'nodes example: <markdown>child-node="children"</markdown>'
      },
      {
        name: 'node-template-url',
        required: false,
        default: '<span>{{ item.name || "" }}</span>',
        type: 'String',
        description: 'template to render the node properties. Look at treeNode.html ' +
          'file in the code section.'
      },
      {
        name: 'node-header-url',
        required: false,
        default: 'NA',
        type: 'Template similar to node template, but it has the ' +
          'header tags. (EX: id, name, status). Look at treeHeader.html in code section.',
        description: ''
      },
      {
        name: 'children-padding',
        required: false,
        default: '15px',
        type: 'String',
        description: 'Padding/distance from parent level'
      },
      {
        name: 'has-children',
        required: false,
        default: 'NA',
        type: 'String',
        description: 'Name of the function that checks the availability of the children for an item.' +
          'This is only needed if you are doing lazy loading. If function returns false (row is a leaf),' +
          'The toggle arrow will not be shown.'
      },
      {
        name: 'row-ng-class',
        required: false,
        default: 'NA',
        type: 'String',
        description: 'ng-class expression that will be applied to each row. ex: {active: item._selected}'
      },
      {
        name: 'toggle-callback',
        required: false,
        default: 'NA',
        type: 'String',
        description: 'This function is to lazy load the tree levels.' +
          'Provide the path to toggle function (ex: "methods.loadChildren"). If you do provide this, ' +
          'the tree item will be passed to this function every time some one toggles a tree level. ' +
          'In this case, you need to set the _expanded' +
          'property to true or false. You can also set loading property to true or false on the item.' +
          'If you set _loading to true, the ui will show the _loading icon on that tree level.'
      },
      {
        name: 'bordered',
        required: false,
        default: 'false',
        type: 'boolean',
        description: 'If true, adds border to the tree levels'
      },
      {
        name: 'expand-icon-class',
        required: false,
        globalConfig: true,
        default: 'glyphicon glyphicon-plus-sign',
        type: 'String',
        description: 'class of te expand icon'
      },
      {
        name: 'collapse-icon-class',
        required: false,
        globalConfig: true,
        default: 'glyphicon glyphicon-minus-sign',
        type: 'String',
        description: 'class of te collapse icon'
      },
      {
        name: 'loading-icon-class',
        required: false,
        globalConfig: true,
        default: 'glyphicon glyphicon-refresh ad-spin',
        type: 'String',
        description: 'class of te loading icon'
      }
    ]
  }
];

// ========== initialize documentation app module ========== //
angular.module('adaptv.adaptStrapDocs', [
  'ngSanitize',
  'adaptv.adaptStrap'
])

// ========== documentation support onstants =========== //
.constant('adaptStrapModules', window.adaptStrapModules)

// ========== documentation support controllers ========== //
.controller('layoutCtrl', ['$scope', '$anchorScroll', '$location', 'adaptStrapModules',
  function ($scope, $anchorScroll, $location, adaptStrapModules) {
    $scope.modules = adaptStrapModules;
    $scope.scrollTo = function (id, $event) {
      $event.preventDefault();
      $location.hash(id);
      $anchorScroll();
    };
  }
])

// ========== documentation support directives ========== //
.directive('markdown', function ($compile, $http) {
  var converter = new Showdown.converter();
  return {
    restrict: 'E',
    replace: true,
    link: function (scope, element, attrs) {
      function load() {
        if ('src' in attrs) {
          $http.get(attrs.src).then(function (data) {
            var format = attrs.src.split('.');
            if (format[format.length - 1] === 'js' || format[format.length - 1] === 'html') {
              data.data = '```\n' + data.data + '\n```';
            }
            element.html(converter.makeHtml(data.data));
            element.find('pre code').each(function (i, block) {
              hljs.highlightBlock(block);
            });
          });
        } else {
          element.html(converter.makeHtml(element.html()));
          element.find('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
          });
        }
      }
      attrs.$observe('src', function () {
        load();
      });
    }
  };
})
.directive('codeNavigator', [function () {
  return {
    link: function (scope) {
      scope.currentFile = scope.files[0];
      scope.setCurrentFile = function (file) {
        scope.currentFile = file;
      };
    },
    restrict: 'E',
    scope: {
      files: '=',
      basePath: '@'
    },
    templateUrl: 'docs/codeNavigator.html'
  };
}])
.directive('componentOptions', [function () {
  return {
    link: function (scope) {

    },
    restrict: 'E',
    scope: {
      module: '='
    },
    templateUrl: 'docs/componentOptions.html'
  };
}]);
