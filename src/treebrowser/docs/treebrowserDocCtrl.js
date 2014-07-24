angular.module('adaptv.adaptStrapDocs')
    .controller('treebrowserDocCtrl', ['$scope', function ($scope) {
        $scope.root = {
            children: [
                {
                    name: 'Bmw',
                    children: [
                        {
                            name: '328i'
                        },
                        {
                            name: '335i'
                        },
                        {
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
                                },
                                {
                                    name: 'Quattro Prestige'
                                },
                                {
                                    name: 'FWD'
                                }
                            ]
                        },
                        {
                            name: 'A6'
                        },
                        {
                            name: 'A8'
                        }
                    ]
                },
                {
                    name: 'Honda',
                    children: [
                        {
                            name: 'Civic'
                        },
                        {
                            name: 'Accord'
                        },
                        {
                            name: 'CRV'
                        }
                    ]
                }
            ]
        }
    }]);