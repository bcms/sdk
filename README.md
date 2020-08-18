# BCMS SDK

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
