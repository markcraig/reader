/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright 2014 Mark Craig
 */

/*global
    angular, Date
*/

angular
    .module('main', ['ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ui.bootstrap'])
    .factory('FeedLoader', function ($resource) {
        "use strict";
        return $resource('//ajax.googleapis.com/ajax/services/feed/load', {}, {
            fetch: {
                method: 'JSONP',
                params: {
                    v: '1.0',
                    callback: 'JSON_CALLBACK'
                }
            }
        });
    })
    .service('FeedList', function ($resource, FeedLoader) {
        "use strict";
        this.get = function (lastVisit) {
            var feeds, feedList, FeedList;

            feeds = [];
            FeedList = $resource('examples/feeds.json');
            feedList = FeedList.query({}, function (result) {
                var i, handleList;
                feedList = result || [];

                handleList = function (data) {
                    var feed, j, recent;
                    feed = data.responseData.feed;
                    recent = {
                        feedUrl: feed.feedUrl,
                        title: feed.title,
                        link: feed.link,
                        description: feed.description,
                        author: feed.author,
                        entries: []
                    };

                    for (j = 0; j < feed.entries.length; j += 1) {
                        if (lastVisit < new Date(feed.entries[j].publishedDate)) {
                            recent.entries.push(feed.entries[j]);
                        }
                    }
                    feeds.push(recent);
                };

                for (i = 0; i < feedList.length; i += 1) {
                    FeedLoader.fetch({q: feedList[i].url, num: 5}, {}, handleList);
                }
            });

            return feeds;
        };
    })
    .config(function ($routeProvider) {
        "use strict";
        $routeProvider
            .when('/', {
                templateUrl: 'partials/feeds.html',
                controller: function ($scope, $cookieStore, $log, $sce, FeedList) {
                    var lastVisit, date;

                    $scope.nothingToRead = false;

                    // Consider that the date of the last visit
                    // was the beginning of the epoch,
                    // unless the date of the last visit
                    // can be read from a cookie, 
                    // where the cookie format is:
                    // <date>;Expires=<date>
                    lastVisit = new Date(0);
                    date = $cookieStore.get('lastVisit') || "";
                    if (date !== "") {
                        lastVisit = new Date(date.split(";")[0]); // ;Expires=...
                    }

                    $scope.feeds = FeedList.get(lastVisit);
                    $scope.$on('FeedList', function (event, data) {
                        $log.info("event type: " + typeof event);

                        if (data.length === 0) {
                            $scope.nothingToRead = true;
                            $scope.feeds = [];
                        } else {
                            $scope.feeds = data.sort(function (a, b) {
                                var compare;
                                compare = a.title.toString().toLowerCase().
                                        localeCompare(b.title.toLowerCase().toString());
                                return compare;
                            });
                        }

                        // Store the date of this visit in a cookie
                        // that expires a week from now.
                        $cookieStore.put('lastVisit', function () {
                            var now, expireTime, cookieValue;

                            now = new Date();
                            expireTime = new Date();
                            expireTime.setTime(now.getTime() + 1000 * 3600 * 24 * 7);

                            // <now>;Expires=<expireTime>
                            cookieValue = now.toGMTString() +
                                    ";Expires=" + expireTime.toGMTString();
                            return cookieValue;
                        });
                    });

                    $scope.trust = function (html) {
                        return $sce.trustAsHtml(html);
                    };
                }
            })
            .when('/about', {
                templateUrl: 'partials/about.html'
            })
            .when('/configure', {
                templateUrl: 'partials/configure.html',
                controller: function ($scope) {
                    $scope.message = "Not implemented yet";
                }
            });
    });
