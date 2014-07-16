angular.module('adaptv.adaptStrapDocs')
    .controller('treebrowserDocCtrl', ['$scope', function ($scope) {
        $scope.title = 'hello world';
        $scope.data = {
            root: {
                children: [
                    {
                        name: 'one',
                        children: [
                            {
                                name: 'one - 1'
                            },{
                                name: 'one - 2'
                            },{
                                name: 'one - 3'
                            }
                        ]
                    },
                    {
                        name: 'two'
                    },
                    {
                        name: 'three'
                    }
                ]
            }
        }
    }]);