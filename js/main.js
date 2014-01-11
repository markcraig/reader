/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright 2014 Mark Craig
 */

angular.module('main', ['ngRoute', 'ui.bootstrap'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/empty.html',
                controller: function($scope) {
                    $scope.message = 'Nothing to read right now';
                }
            })
            .when('/configure', {
                templateUrl: 'partials/configure.html',
                controller: function($scope) {
                    // Nothing yet
                }
            })
    });
