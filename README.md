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