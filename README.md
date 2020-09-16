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

## Caching

Big part of the SDK functionality is data caching. Cache is useful to minimize number of requests to the Backend server, reduce internet usage are make better performing UI. This is done by sending one request to get specified data and then data is store locally. When data is required again, request does not need to be sent to the Backend since data is already present in the memory. This means that performance is mush faster and network payload over time is mush smaller. This is nice to have but tricky to implement and understand, event more when multiple client can consume application at the same time which is the case with BCMS. Caching is awesome but it needs to be synchronized with the data on the Backend and between clients. To illustrate how BCMS SDK Cache works, one use case will be covered.

Once login, client application wants to get all Widgets. This will be done by calling `sdk.widget.getAll()`. Since this is a first time this method is called, network request will be sent to the Backend and data will be received. This data will be stored in memory and copy of the data will be returned to the client. Some time later, client application will again request all widgets but this time when `sdk.widget.getAll()` is called, cache check will occur and since data is preset in the cache, copy of it will be returned to the client, without make a network request. Therefore second request will be mush faster, without a delay. At this point in time, client application wants to make some changes to a widget and it will call `sdk.widget.update(myUpdatedWidget)`. Network request will be sent to the Backend and it will respond will updated widget. SDK will get the response, and update specified widget in the cache. If widget does not exist in the cache, it will be added. For a single client application use case, this is pretty strate forward because only way that something can change on the Backend is by a single client and SDK will know about the change. Complexity arise when more then 1 client application is connected to the same Backend at the same time.

For simplicity reasons, there will be only 2 client applications connected at the same time, called C1 and C2. Both clients will get all widgets. At this point both C1 and C2 have synchronized cache with the Backend, problem arise when C1 updates a widget. Without some mechanism to inform C2 that a widget is updates, C2s cache will not be synchronized with the Backend and weird problems can occur because of this. In BCMS SDK this problem is solved using sockets. Once some sort of an update occurs on the Backend, event with update will be sent to all active socket. This way, C2 will be informed that update of a widget has happened and it will fetch it, synchronizing data will the Backend. Client application can also know about this update (for example, this can be important if data on the screen needs to be re-rendered or a user needs to be informed about an update) but subscribing to the event using `sdk.socket.subscribe(eventName, handler)`.

In short, caching is tricking and supported by the SDK, therefore client application does not need to worry about it. For cache implementation see [full SDK API reference](https://bcms.com/modules/sdk/api).

## Sockets

As it can be seen in the section above, sockets are playing big role in cache synchronization but in addition to that, they are very powerful tool for the client application. Bellow is an example for how to use socket.

```jsx
// --------------------------------
// ---- my-ui-component.svelte ----
// --------------------------------

import React, { useState, useEffect } from 'react';
import { SocketEventName } from '@becomes/cms-sdk';

export default function Widgets({ sdk }) {
  const [widgets, setWidgets] = useState([]);
  const widgetSubscription = sdk.socket.subscribe(
    SocketEventName.WIDGET,
    (data) => {
      switch (data.type) {
        case 'update':
          {
            const widget = sdk.widget.get(data.entry._id);
            setWidgets(
              ...widgets.map((w) => {
                if (w._id === data.entry._id) {
                  return widget;
                }
                return w;
              }),
            );
          }
          break;
        case 'add':
          {
            const widget = sdk.widget.get(data.entry._id);
            setWidgets([...widgets, widget]);
          }
          break;
        case 'remove':
          {
            setWidgets(...widgets.filter((w) => w._id !== data.entry._id));
          }
          break;
      }
    },
  );
  useEffect(() => {
    return () => {
      // When component is destroyed.
      widgetSubscription.unsubscribe();
    };
  }, []);
  return <div>{JSON.stringify(widgets, null, '  ')}</div>;
}
```

## API reference

- Full API reference can be explored at: [https://bcms.com/modules/sdk/api](https://bcms.com/modules/sdk/api)

