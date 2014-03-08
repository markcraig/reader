/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright 2014 Mark Craig
 */

angular.module('main', ['ngResource', 'ngRoute', 'ngSanitize', 'ui.bootstrap'])
    .factory('Feeds', function ($resource) {
        return $resource('examples/feeds.json', {}, {
                get: {
                    method: 'GET',
                    isArray: true
                }
        });
    })
    .factory('FeedLoader', function ($resource) {
        return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
            fetch: {
                method: 'JSONP',
                params: {
                    v: '1.0',
                    callback: 'JSON_CALLBACK'
                }
            }
        });
    })
    .service('FeedList', function ($rootScope, Feeds, FeedLoader) {
        this.get = function () {
            var feedList, feeds, i;

            //feedList = Feeds.get();
            feedList = [
                {
                    "url": "http://www.jwz.org/blog/feed/",
                    "title": "jwz"
                },
                {
                    "url": "http://ludopoitou.wordpress.com/feed/",
                    "title": "Ludo's Sketches"
                },
                {
                    "url": "http://marginnotes2.wordpress.com/feed/",
                    "title": "Margin Notes 2.0"
                },
                {
                    "url": "https://www.tbray.org/ongoing/ongoing.atom",
                    "title": "ongoing by Tim Bray"
                },
                {
                    "url": "http://www.schneier.com/blog/atom.xml",
                    "title": "Schneier on Security"
                }
            ]

            feeds = [];
            for (i = 0; i < feedList.length; i += 1) {
                FeedLoader.fetch({q: feedList[i].url}, {}, function (data) {
                    var feed = data.responseData.feed;
                    console.log(angular.toJson(feed));
                    feeds.push(feed);
                });
            }
            return feeds;
        }
    })
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/feeds.html',
                controller: function($scope, $sce, FeedList) {
                    $scope.feeds = FeedList.get();
                    $scope.$on('FeedList', function (event, data) {
                        $scope.feeds = data;
                    });
                    $scope.trust = function (html) {
                        return $sce.trustAsHtml(html);
                    }
                }
            })
            .when('/configure', {
                templateUrl: 'partials/configure.html',
                controller: function($scope) {
                    // Nothing yet
                }
            })
    });
