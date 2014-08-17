// ========== modules documentation configuration ========== //
angular.module('adaptv.adaptStrapDocs').constant('adaptStrapModules', [
  {
    moduleName: 'tablelite',
    displayName: 'Table Lite',
    controllerName: 'tableliteCtrl',
    description: 'simple table UI that renders your local data models and does local pagination/sorting',
    playGroundUrl: 'http://jsfiddle.net/kashjs/gt8Ljspf/',
    docFiles: [
      'tablelite.view.html',
      'tablelite.ctrl.js'
    ],
    directives: [{
      name: 'ad-table-lite',
      options: [
        {
          name: 'table-name',
          required: true,
          default: 'NA',
          type: 'String',
          description: 'Name of the table. Name has to be so that it' +
            ' can be a valid javascript variable name. Make sure that your scope does not have' +
            'a property with the same name as the tree-name'
        },
        {
          name: 'column-definition',
          required: true,
          default: 'NA',
          type: 'String',
          description: 'Path to the object (array) that has all the column definitions. ' +
            'Look at more info for details on how to build columnDefinition object'
        },
        {
          name: 'local-data-source',
          required: true,
          default: 'NA',
          type: 'String',
          description: 'Array of items to be rendered in table'
        },
        {
          name: 'page-sizes',
          required: false,
          default: '[10, 25, 50]',
          type: 'String',
          description: 'Available page sizes'
        },
        {
          name: 'disable-paging',
          required: false,
          default: 'false',
          type: 'Boolean',
          description: 'shows all the items in local-data-source'
        },
        {
          name: 'table-classes',
          required: false,
          default: '"table"',
          type: 'String',
          description: 'these classes will be applied to the table tag. ' +
            'Ex (<code>table-classes: "table table-bordered"</code>)'
        },
        {
          name: 'pagination-btn-group-classes',
          required: false,
          default: '"btn-group btn-group-sm"',
          type: 'String',
          description: 'these classes will be applied to the pagination btn-group tag. ' +
            'Ex (<code>pagination-btn-group-classes="btn-group btn-group-xs"</code>)'
        },
        {
          name: 'selected-items',
          required: false,
          default: 'NA',
          type: 'String',
          description: 'Path to the array that will hold selected items. ' +
            '<code>ex: selected-items="models.selectedCars"</code>. If speecified, the rows will be' +
            ' selectable by checkbox. selected rows will have <code>ad-selected</code> class on it. ' +
            'You can target this class in your css to apply custom styling to the selected rows.'

        }
      ]
    }]
  },
  {
    moduleName: 'tableajax',
    displayName: 'Table AJAX',
    controllerName: 'tableajaxCtrl',
    description: 'advanced table UI that renders remote data models and does remote pagination/sorting',
    playGroundUrl: 'http://jsfiddle.net/kashjs/1f806L2k/',
    docFiles: [
      'tableajax.view.html',
      'tableajax.ctrl.js',
      'artistPicture.html'
    ],
    directives: [{
      name: 'ad-table-ajax',
      options: [
        {
          name: 'table-name',
          required: true,
          default: 'NA',
          type: 'String',
          description: 'Name of the table. Name has to be so that it' +
            ' can be a valid javascript variable name. Make sure that your scope does not have' +
            'a property with the same name as the tree-name'
        },
        {
          name: 'column-definition',
          required: true,
          default: 'NA',
          type: 'String',
          description: 'Path to the object (array) that has all the column definitions. ' +
            'Look at more info for details on how to build columnDefinition object'
        },
        {
          name: 'table-classes',
          required: false,
          default: '"table"',
          type: 'String',
          description: 'these classes will be applied to the table tag. ' +
            'Ex (<code>table-classes: "table table-bordered"</code>)'
        },
        {
          name: 'ajax-config',
          required: true,
          default: 'NA',
          type: 'String',
          description:  'Path to the object that has ajax configuration. ' +
            'Look at more info for details on how to build ajaxConfig object'
        },
        {
          name: 'page-sizes',
          required: false,
          default: '[10, 25, 50]',
          type: 'String',
          description: 'Available page sizes'
        },
        {
          name: 'pagination-btn-group-classes',
          required: false,
          default: '"btn-group btn-group-sm"',
          type: 'String',
          description: 'these classes will be applied to the pagination btn-group tag. ' +
            'Ex (<code>pagination-btn-group-classes="btn-group btn-group-xs"</code>)'
        },
        {
          name: 'page-loader',
          required: false,
          default: 'adaptStrap default page loader',
          type: 'path',
          description: 'You can specify your own page loader. Adapt Strap has its own page loader that makes ajax ' +
            'calls to load items. Look at adLoadPage in utils.js in the source to see how it is implemented. ' +
            'But for some reason if you need to provide your own page loader, you can specify the path ' +
            'to that function on your scope. Look at more info below to find out how request object looks like and ' +
            'what is expected from this function'
        }
      ]
    }]
  },
  {
    moduleName: 'treebrowser',
    displayName: 'Tree Browser',
    controllerName: 'treebrowserCtrl',
    playGroundUrl: 'http://jsfiddle.net/kashjs/056z7xtr/',
    description: 'simple tree UI that allows you to brows through local data models in tree structure',
    docFiles: [
      'treebrowser.view.html',
      'treebrowser.ctrl.js',
      'treeNode.html',
      'treeHeader.html'
    ],
    directives: [{
      name: 'ad-tree-browser',
      options: [
        {
          name: 'tree-name',
          required: true,
          type: 'String',
          default: 'NA',
          description: 'Name of the tree. Name has to be so that it' +
            ' can be a valid javascript variable name. Make sure that your scope does not have' +
            'a property with the same name as the tree-name'
        },
        {
          name: 'tree-root',
          required: true,
          type: 'String',
          default: 'NA',
          description: 'root path to the tree data structure ' +
            'example: <code>tree-root="data.root"</code>'
        },
        {
          name: 'child-node',
          required: true,
          type: 'String',
          default: 'NA',
          description: 'name of the object that contains children ' +
            'nodes example: <code>child-node="children"</code>'
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
          description: 'ng-class expression that will be applied to each row. ' +
            'ex: <code>row-ng-class={active: item._selected}</code>'
        },
        {
          name: 'toggle-callback',
          required: false,
          default: 'NA',
          type: 'String',
          description: 'This function is to lazy load the tree levels.' +
            'Provide the path to toggle function ' +
            '(ex: <code>toggle-callback="methods.loadChildren"</code>). If you do provide this, ' +
            'the tree item will be passed to this function every time some one toggles a tree level. ' +
            'In this case, you need to set the _ad_expanded' +
            'property to true or false. You can also set loading property to true or false on the item.' +
            'If you set _ad_loading to true, the ui will show the _ad_loading icon on that tree level.'
        },
        {
          name: 'bordered',
          required: false,
          default: 'false',
          type: 'boolean',
          description: 'If true, adds border to the tree levels'
        }
      ]
    }]
  },
  {
    moduleName: 'loadingindicator',
    displayName: 'Loading Indicator',
    controllerName: 'loadingIndicatorCtrl',
    description: 'simple directives to render overlay and inline loading indicators',
    playGroundUrl: 'http://jsfiddle.net/kashjs/n79ydkjh/',
    docFiles: [
      'loadingindicator.view.html',
      'loadingindicator.ctrl.js'
    ],
    directives: [
      {
        name: 'ad-loading-overlay',
        options: [
          {
            name: 'loading',
            required: true,
            globalConfig: false,
            default: 'NA',
            type: 'Boolean',
            description: 'model to show or hide the loading overlay'
          },
          {
            name: 'zIndex',
            required: false,
            globalConfig: false,
            default: '2000',
            type: 'String',
            description: 'z-index of the overlay'
          },
          {
            name: 'position',
            required: false,
            globalConfig: false,
            default: 'absolute',
            type: 'String',
            description: 'This can be either "absolute" or "fixed", ' +
              'in case of "absolute", the parent container need to have none static positioning (Ex: "relative")'
          },
          {
            name: 'container-classes',
            required: false,
            globalConfig: false,
            default: 'NA',
            type: 'String',
            description: 'you may want to add custom class to your ' +
              'overlay container. pass it into this attribute'
          },
          {
            name: 'loading-icon-class',
            required: false,
            globalConfig: true,
            default: '"glyphicon glyphicon-refresh ad-spin"',
            type: 'String',
            description: 'This property is globally configurable. ' +
              'But you can always pass in the value to override global configuration'
          },
          {
            name: 'loading-icon-size',
            required: false,
            globalConfig: false,
            default: '3em',
            type: 'String',
            description: 'You can pass in the size of spinner icon. ' +
              'Ex: <code>loading-icon-size="30px"</code>'
          }
        ]
      },
      {
        name: 'ad-loading-icon',
        options: [
          {
            name: 'loading-icon-class',
            required: false,
            globalConfig: true,
            default: '"glyphicon glyphicon-refresh ad-spin"',
            type: 'String',
            description: 'This property is globally configurable. ' +
              'But you can always pass in the value to override global configuration'
          },
          {
            name: 'loading-icon-size',
            required: false,
            globalConfig: false,
            default: 'font-size inherited from parent elements',
            type: 'String',
            description: 'You can pass in the size of spinner icon. ' +
              'Ex: <code>loading-icon-size="16px"</code>'
          }
        ]
      }
    ]
  }
]);
