# Dashboard

- Require sign-in and display only links belonging to the current user.
- Display the user's links in a table with short code and URL columns.
- Automatically search by short code or destination URL after 300 ms of
  inactivity, ignoring case. Keep the total link count independent of search.
- Provide an action to open valid HTTP(S) destination URLs in a new tab.
- Allow users to edit their own destination URLs in a modal and delete their
  own links after confirmation. Keep short codes unchanged when editing.
