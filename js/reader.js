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

