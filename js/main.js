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
    .service('Cookies', function () {
        "use strict";

        // Thanks to http://www.quirksmode.org/js/cookies.html

        // Create a cookie set to expire in the specified number of days.
        // name=value; expires=days in the future; path=/
        this.createCookie = function (name, value, days) {
            var date, expires;

            if (days) {
                date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        };

        // Set the cookie by name to be expired already.
        this.eraseCookie = function (name) {
            this.createCookie(name, "", -1);
        };

        // Read the cookie value by name.
        // Returns the cookie value, as in name=value, or null if not found.
        this.readCookie = function (name) {
            var nameEquals, cookieArray, i, cookie;

            nameEquals = name + "=";

            // Get all cookies.
            cookieArray = document.cookie.split(';');

            // For each individual cookie...
            for (i = 0; i < cookieArray.length; i += 1) {
                cookie = cookieArray[i];

                // Remove leading spaces.
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1, cookie.length);
                }

                // Return the first cookie that matches by name.
                if (cookie.indexOf(nameEquals) === 0) {
                    return cookie.substring(nameEquals.length, cookie.length);
                }
            }

            return null;
        };
    })
    .config(function ($routeProvider) {
        "use strict";

        $routeProvider
            .when('/', {
                templateUrl: 'partials/feeds.html',
                controller: function ($scope, $log, $route, $sce, FeedList, Cookies) {
                    var cookieName, cookie, lastVisit;

                    $scope.nothingToRead = false;

                    // If a last visit cookie is already set,
                    // then get the time of the last visit.
                    // Otherwise the time of the last visit is now.
                    cookieName = "myLastVisit";
                    cookie = Cookies.readCookie(cookieName);

                    lastVisit = new Date();
                    if (cookie) {
                        lastVisit = new Date(cookie);
                    }
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

                        if ($scope.feeds.length === 0) {
                            $scope.nothingToRead = true;
                        }
                    });

                    $scope.trust = function (html) {
                        return $sce.trustAsHtml(html);
                    };

                    // Store the date of this visit in a last visit cookie
                    // that expires a week (7 days) from now.
                    Cookies.createCookie(cookieName, lastVisit.toGMTString(), 7);

                    // Remove the last visit cookie and reload.
                    $scope.reloadAll = function () {
                        Cookies.eraseCookie(cookieName);
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
