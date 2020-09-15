# BCMS SDK

Idea behind this module is to abstract API communication for BCMS UI developers. Without this module, UI developers would have to implement REST or GraphQL API from the Backend module and take care of caching and storing data. This is not an easy task, therefore this module is developed to allow UI developers to focus on interface and user experience and not worry about request payload size, streams and sockets.

With this in mind, BCMS SDK is an abstraction layer between UI and Backend of the BCMS. Some of the things that this module covers are:

- Cache layer - caching is done in memory which means that data is available only during same session. If browser tab is reloaded, cache is lost.
- Authentication - there is no need to worry about security tokens and life-cycles.
- Communication with Backend API - no need to make HTTP requests, just use abstract methods to get data, like for example `sdk.template.getAll()` to get all available templates.
- Sockets - data synchronization is also handled and cache will always be in sync with other sessions.

## Getting started

Install package `npm i --save @becomes/cms-sdk` and create and SDK instance as shown:

```js
import { BCMS } from '@becomes/cms-sdk';

const sdk = BCMS({
  cms: {
    origin: 'http://localhost:1280',
  },
});
```

With this done, you have created an SDK object which you can use to communicate with a backend. Have in mind that user which is using the SDK must be logged in to access protected resourced, therefore when application is initialized, first check if user is logged in and then call protected resource, as shown in the code below.

```js
// Abstract method. For example in VueJS this will be handled
// in the router.
async applicationInitialize() {
  if (!(await sdk.isLoggedIn())) {
    return;
  }
  const users = sdk.users.getAll();
  console.log(users);
}
```

## Useful links

- Full API reference can be explored at: [https://bcms.com/modules/sdk/api](https://bcms.com/modules/sdk/api)
- Play with an SDK: [https://bcms.com/modules/sdk/playground](https://bcms.com/modules/sdk/playground)
