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
            for (var i = 0; i < feeds.length; i++) {
                var results = feedsTable.query({url: feeds[i].url});
                if (results.length === 0) {
                    feedsTable.insert(feeds[i]);
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
            var feeds = feedsTable.query();
            for (var i = 0; i < feeds.length; i++) {
                theFeeds.push({
                    url: feeds[i].get('url'),
                    title: feeds[i].get('title')
                });
            }

        });
        datastoreManager.close();
        
        // TODO: The return must wait for the datastore queries to finish.
        // See https://www.dropbox.com/developers/browse_datastores/381904
        // for expected content.
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
            var results = feedsTable.query();
            for (var i = 0; i < results.length; i++) results[i].deleteRecord();
        }
    });
    datastoreManager.close();
    */

    useDropbox = true;
    $('#useDropbox').hide();
    console.log("Client is using Dropbox.");
}
