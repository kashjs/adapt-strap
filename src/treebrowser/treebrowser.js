'use strict';

angular.module('adaptv.adaptStrap.treebrowser')

    .provider('$treebrowser', function() {
        var defaults = this.defaults = {
            expandIcon: '',
            collapseIcon: '',
            loadingIcon: ''
        };
        this.$get = function() {
            return {
                settings: defaults
            };
        };
    })

    .directive('adTreeBrowser', function() {
        return {
            restrict: 'E',
            link: function postLink(scope, element, attr) {

            }
        };
    });