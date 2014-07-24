angular.module('adaptv.adaptStrapDocs', [
    'ngRoute',
    'adaptv.adaptStrap'
])

    .config(['$routeProvider', function ($routeProvider) {
        'use strict';
        $routeProvider.when('/treebrowser', {
            templateUrl: 'src/treebrowser/docs/treebrowserDoc.html',
            controller: 'treebrowserDocCtrl'
        }).otherwise({redirectTo: '/treebrowser'});
    }]);

// Render markdown in the HTML page
angular.module('adaptv.adaptStrapDocs').directive("markdown", function ($compile, $http) {
    var converter = new Showdown.converter();
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            function load() {
                if ("src" in attrs) {
                    $http.get(attrs.src).then(function(data) {
                        var format = attrs.src.split('.');
                        if (format[format.length - 1] === 'js' || format[format.length - 1] === 'html') {
                            data.data = '```\n' + data.data + '\n```';
                        }
                        element.html(converter.makeHtml(data.data));
                    });
                } else {
                    element.html(converter.makeHtml(element.html()));
                }
            }
            attrs.$observe('src', function () {
                load();
            })
        }
    };
})
    .directive('codeNavigator', [function () {
        return {
            link: function (scope) {
                scope.currentFile = scope.files[0];
                scope.setCurrentFile = function (file) {
                    scope.currentFile = file;
                }
            },
            restrict: 'E',
            scope: {
                files: '=',
                basePath: '@'
            },
            templateUrl: 'docs/codeNavigator.html'
        }
    }]);