/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright 2014 Mark Craig
 */

angular.module('main', ['ngResource', 'ngRoute', 'ngSanitize', 'ui.bootstrap'])
        .factory('FeedLoader', function($resource) {
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
        .service('FeedList', function($rootScope, $resource, FeedLoader) {
            this.get = function() {
                var feeds, FeedList, feedList, i;

                feeds = [];
                FeedList = $resource('examples/feeds.json');
                feedList = FeedList.query({}, function(result) {
                    feedList = result || [];

                    for (i = 0; i < feedList.length; i += 1) {
                        FeedLoader.fetch({q: feedList[i].url}, {}, function(data) {
                            var feed = data.responseData.feed;
                            feeds.push(feed);
                        });
                    }
                    feeds = feeds.sort(function(a, b) {
                        var compare = a.title.toString().toLowerCase().
                                localeCompare(b.title.toLowerCase().toString());
                        return compare;
                    });
                });

                return feeds;
            };
        })
        .config(function($routeProvider) {
            $routeProvider
                    .when('/', {
                        templateUrl: 'partials/feeds.html',
                        controller: function($scope, $sce, FeedList) {
                            $scope.nothingToRead = false;

                            $scope.feeds = FeedList.get();
                            $scope.$on('FeedList', function(event, data) {
                                $scope.feeds = data;
                                if ($scope.feeds === []) {
                                    $scope.nothingToRead = true;
                                }
                            });

                            $scope.trust = function(html) {
                                return $sce.trustAsHtml(html);
                            };
                        }
                    })
                    .when('/about', {
                        templateUrl: 'partials/about.html'
                    })
                    .when('/configure', {
                        templateUrl: 'partials/configure.html',
                        controller: function($scope) {
                            // Nothing yet
                        }
                    });
        });
