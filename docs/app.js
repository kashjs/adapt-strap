angular.module('adaptv.adaptStrapDocs', [
    'ngRoute',
    'adaptv.adaptStrap'
])
    .config(['$routeProvider', function ($routeProvider) {
        'use strict';
        $routeProvider.when('/treebrowser', {
            templateUrl: 'src/treebrowser/docs/treebrowserDoc.html',
            controller: 'treebrowserDocCtrl'
        }).otherwise({redirectTo: '/treebrowser'});;
    }]);