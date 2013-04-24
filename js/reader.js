/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright 2013 Mark Craig
 */

/** Reader Last Visit */
var cookieName = 'RLV';

/**
 * Sort feeds by title
 */
function sortFeeds(feeds) {
    return feeds.sort(function(a, b) {
        return a.title.toString().localeCompare(b.title.toString());
    });
}

/**
 * Store feeds in local storage.
 */
function storeFeeds(feeds) {
    localStorage.feeds = JSON.stringify(feeds);    
}

/**
 * Return feeds from local storage.
 */
function loadFeeds() {
    if (localStorage.feeds !== undefined && localStorage.feeds !== "") {
        var feeds = sortFeeds(JSON.parse(localStorage.feeds));
        return feeds;
    } else {
        return [];
    }
}
