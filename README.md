# Feed Reader

This is a project to kick the tires on the [Cloud9 IDE](https://c9.io/).

The home page uses the [Google Feed API](https://developers.google.com/feed/v1/)
to read some feeds, and then displays the results as the body of the page.

It sets a cookie when you visit. On the next visit, it displays
only entries that have not already been read.

## TODO
*   Sort feeds by title.
*   If feed has nothing new, do not show it.
*   If all feeds are empty, show "Nothing new to read."
*   Replace hard-coded feed list with dynamic list (add/delete, load/save).
*   Beautify the layout.
