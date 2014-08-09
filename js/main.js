/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright 2014 Mark Craig
 */

/*global
    angular, Date, document
*/

angular
    .module('main', ['ngResource', 'ngRoute', 'ngSanitize', 'ui.bootstrap'])
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
                    
                    if (recent.entries.length > 0) {
                        feeds.push(recent);
                    }
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
                controller: function ($scope, $log, $route, $sce, FeedList) {
                    var cookie, lastVisit, now, maxAge, expireTime;

                    $scope.nothingToRead = false;

                    // Consider that the date of the last visit
                    // was the beginning of the epoch,
                    // unless the date of the last visit
                    // can be read from a cookie, 
                    // where the cookie format is:
                    // myLastVisit=<now>;max-age=<maxAge>;expires=<expireTime>;
                    cookie = document.cookie.replace(/(?:(?:^|.*;\s*)myLastVisit\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                    (cookie) ? lastVisit = new Date(cookie) : lastVisit = new Date(0);
                    $log.log("lastVisit: " +  lastVisit.toGMTString());

                    $scope.feeds = FeedList.get(lastVisit);
                    $scope.$on('FeedList', function (event, data) {
                        $log.log("event type: " + typeof event);
 
                        $scope.feeds = data.sort(function (a, b) {
                            var compare;
                            compare = a.title.toString().toLowerCase().
                                    localeCompare(b.title.toLowerCase().toString());
                            return compare;
                        });
                        
                        if ($scope.feeds === []) {
                            $scope.nothingToRead = true;
                        }
                    });

                    $scope.trust = function (html) {
                        return $sce.trustAsHtml(html);
                    };

                    // Store the date of this visit in a cookie
                    // that expires a week from now.
                    now = new Date();
                    maxAge = 7 * 24 * 60 * 60; // days * hrs * min * sec
                    expireTime = new Date();
                    expireTime.setTime(now.getTime() + (maxAge * 1000));

                    // myLastVisit=<now>;max-age=<maxAge>;expires=<expireTime>;
                    document.cookie = "myLastVisit=" + now.toGMTString() + ";"
                        + "expires=" + expireTime.toGMTString() + "; path=/";
                
                    $scope.deleteCookie = function () {
                        document.cookie = "myLastVisit=;" +
                        "expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                        $route.reload();
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
