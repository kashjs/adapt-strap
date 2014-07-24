#### Controller
```
$scope.root = {
    children: [
        {
            name: 'Bmw',
            children: [
                {
                    name: '328i'
                },{
                    name: '335i'
                },{
                    name: '535i'
                }
            ]
        },
        {
            name: 'Audi',
            children: [
                {
                    name: 'A4',
                    children: [
                        {
                            name: 'Quattro premium plus'
                        },{
                            name: 'Quattro Prestige'
                        },{
                            name: 'FWD'
                        }
                    ]
                },{
                    name: 'A6'
                },{
                    name: 'A8'
                }
            ]
        },
        {
            name: 'Honda',
            children: [
                {
                    name: 'Civic'
                },{
                    name: 'Accord'
                },{
                    name: 'CRV'
                }
            ]
        }
    ]
};
```
#### View
```
<div class="ad-border-default"
     ad-tree-browser
     data-tree-name="segments"
     data-row-ng-class="{added:true}"
     data-tree-root="root"
     data-child-node="children"
     data-children-padding="15"
     data-toggle-callback="segmentToggle"
     data-bordered="true"
     data-node-header-url="src/treebrowser/docs/treeHeader.html"
     data-node-template-url="src/treebrowser/docs/treeNode.html">
</div>
```