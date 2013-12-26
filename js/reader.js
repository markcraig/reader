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

/**
 * Whether to store reader data in Dropbox.
 */
var useDropbox = false;

/**
 * Dropbox client for Datastore API.
 * 
 * The client can save feeds in the reader's Dropbox,
 * enabling synchronization across browsers.
 */
var client;

/**
 * Get access token with reader interaction.
 * Access token is not returned, but instead kept by the Datastore API.
 */
function signInWithDropbox() {
    OAuth.initialize('1l8ho8v29rinx6f');
    OAuth.popup('dropbox', function(error, result) { //TODO: use redirect as popup is blocked
        if (error) {
            alert('Failed to get access to Dropbox: ' + error);
        }
      //use result.access_token in your API request
        console.log('Access token: ' + result.access_token);
        client = new Dropbox.Client({
            key: "1l8ho8v29rinx6f",
            token: result.access_token
        });
    });
    // client.authenticate();
    useDropbox = true;
    console.log("Client is using Dropbox.");
}

/**
 * Get access token without reader interaction.
 * Access token is not returned, but instead kept by the Datastore API.
 */
function signInWithDropboxQuietly() {
    client = new Dropbox.Client({key: "1l8ho8v29rinx6f"}); // TODO use OAuth.io instead.
    // Try to finish OAuth authorization.
    client.authenticate({interactive: false}, function (error) {
        if (error) {
            alert('Authentication error: ' + error);
        }
    });
}
