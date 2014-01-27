# Reader

This is a project to kick the tires on the [Cloud9 IDE](https://c9.io/).

The home page uses the [Google Feed API](https://developers.google.com/feed/v1/)
to read some feeds, and then displays the results as the body of the page.

It sets a cookie when you visit. On the next visit, it displays
only entries that have not already been read.

At present, feed lists are stored in the browser's local storage. This
does not work well if you use more than one browser.

* * *
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright 2013-2014 Mark Craig
