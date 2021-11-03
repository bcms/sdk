import { Login, sdk } from '../util';

describe('Entry API', async () => {
  Login();

  it('should create new Entry', async () => {
    const result = await sdk.entry.create({
      templateId: '617bd6d347a18d1215aa5efe',
      status: '',
      meta: [
        {
          lng: 'en',
          props: [
            {
              id: 'e949835b-28db-4701-aac1-4dbe59e62cf9',
              data: ['Test'],
            },
            {
              id: '7a89cf02-a5a7-4fc6-8812-cdd3c1aa5375',
              data: ['Test2'],
            },
            {
              id: '8538a4d9-7c0f-4edd-8157-45abbcc84aea',
              data: ['617bd8b847a18d1215aa5f01'],
            },
          ],
        },
      ],
      content: [{ lng: 'en', nodes: [] }],
    });
  });
});
