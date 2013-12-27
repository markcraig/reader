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
 * Store feeds.
 */
function storeFeeds(feeds) {
    if (useDropbox) {
        
        var datastoreManager = client.getDatastoreManager();
        datastoreManager.openDefaultDatastore(function (error, datastore) {
            
            var feedsTable = datastore.getTable('feeds');
            for (var feed in feeds) {
                console.log(JSON.stringify(feed, null, 2)); // TODO: this is "0" when storing feeds from file???
                var existingFeed = feedsTable.get(feed.url);
                if (!existingFeed) {
                    feedsTable.insert(feed);
                }
            }

        });
        datastoreManager.close();

    } else {
        localStorage.feeds = JSON.stringify(feeds);
    }
}

/**
 * Return feeds.
 */
function loadFeeds() {
    if (useDropbox) {
        
        var theFeeds = [];
        
        var datastoreManager = client.getDatastoreManager();
        datastoreManager.openDefaultDatastore(function (error, datastore) {
            
            var feedsTable = datastore.getTable('feeds');
            for (var feed in feedsTable.query()) {
                theFeeds.push({ url: feed.url, title: feed.title});
            }

        });
        datastoreManager.close();

        return (theFeeds.length > 0) ? sortFeeds(theFeeds) : [];
        
    } else if (localStorage.feeds !== undefined && localStorage.feeds !== "") {
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
var client = new Dropbox.Client({key: "1l8ho8v29rinx6f"});


client.authenticate({interactive: false}, function (error) {
    if (error) {
        alert('Authentication error: ' + error);
    }
});

if (client.isAuthenticated()) {
    /* Remove feeds content
    var datastoreManager = client.getDatastoreManager();
    datastoreManager.openDefaultDatastore(function (error, datastore) {
        if (error) {
            alert('Error opening default datastore: ' + error);
        }

        if (datastore.listTableIds().indexOf('feeds') !== -1) {
            var feedsTable = datastore.getTable('feeds');
            var theFeeds = feedsTable.query();
            for (var i = 0; i < theFeeds.length; i++) theFeeds[i].deleteRecord();
        }
    });
    datastoreManager.close();
    */

    useDropbox = true;
    $('#useDropbox').hide();
    console.log("Client is using Dropbox.");
}
