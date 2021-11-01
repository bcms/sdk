// import * as crypto from 'crypto';
// import { sdk, Login, ObjectUtil } from '../util';
// import { ApiKey, ApiKeyMethod } from '../../src/interfaces';

// const hash = crypto.createHash('sha1').update(`${Date.now()}`).digest('hex');
// const ou = ObjectUtil();
// let key: ApiKey;

// describe('Api Key Functions', async () => {
//   Login();
//   it('should create a new Api Key', async () => {
//     key = await sdk.apiKey.add({
//       name: `Test ${hash}`,
//       desc: 'This is some key description.',
//       blocked: false,
//       access: {
//         global: {
//           methods: [
//             ApiKeyMethod.GET,
//             ApiKeyMethod.POST,
//             ApiKeyMethod.PUT,
//             ApiKeyMethod.DELETE,
//           ],
//         },
        
//       },
//     });
//   });
// });
