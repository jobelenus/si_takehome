# si_takehome


## How to run locally
```
npm run dev
```


## How to run cypress tests
```
npx cypress open
```

### Notes

- Using session storage and not local storage to better support the demo of two tabs with different users on the same host machine.
- Added a pending message queue to hold messages that are sent, prior to acceptance by the chat server. For a local demo this isn't that crucial. But it lets me test UI without sending to a backend, and will help in situations of poor connectivity, giving users the indication that your message was actually sent (and clear out the input, etc)
- In general I prefer that components dont necessarily perform data lookup. Stores are better suited to that, and it allows more easy component testing, even if it does sometimes make the prop list long

### Improvements

- Find the appropriate place (e.g. hook, middleware, whatever they call it) in Vue to wrap all fetch POSTs with Accept header
- Also find the appropriate place for more global fetch error handling, rather than at each specific spot. Confirm with designer how they'd like to handle errors (e.g. toasts? or tied to specific form elements?)
- It is probably preferred to have multiple layouts, rather than switching a css class based on the route (e.g. login center vs chat stretch)
— The scrollToLatest feels like an old solution I would have used years ago... so it was the first thing I reached for. I don't know if there is a more modern/recent solution? Or even if something besides flexbox and overflow-y is the answer for this display?
- With *really large* chat history you would not want to load it all, you'd want paging on the backend based on the index number (e.g. /messages?index=<oldest-loaded-index>&history=<int-for-number-messages>)... I imagine implementing something like slack's "-----NEW-----" divider line. You could store the most recent index in local storage, and scroll to that. And then add a scroll handler to update the most recent index...
- Right now the user list is "every user who ever logged in". We don't have an indication of who is online. I presumed the asterisk was to identify who *you* are in the list. I would implement a keep alive on the front end that lets the WS know a user is still connected. And when the socket unloads send a SIGNOUT payload. The backend would need a new endpoint as well to return "online" users... or modify the current user endpoint to include that info.

### Conclusion
Vue has changed a lot since I last used it professionally. I really like the Composition API, it feels a lot better than the old exporting way. And Pinia is much better than VueX. It really does feel like Vue is moving *towards* Svelte in a number of ways.

I stopped a little after the 3hr mark. And I think the largest surface area that need improvement is the error handling. It needs some direction from UX/Design partners for the best experience on how to deliver errors.

As for the code that would make it easier to handle I would approach it by creating some more generic input & form components. I've done this in the past in many frameworks, and have some old svelte examples like this:
https://github.com/jobelenus/sapper_components/blob/master/src/routes/form.svelte
https://github.com/jobelenus/sapper_components/blob/master/src/components/form/Input.svelte

That way the logic is centralized and doesn't need to be repeated. But maybe the Vue community already has a widely popular package to do that, and I'm in the dark. It wouldn't be the first time :) 