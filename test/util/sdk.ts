import { expect } from 'chai';
import { createBcmsSdk } from '../../src';
import { store as Store } from '../../src/dev/store';

const store = Store as any;

export const sdk = createBcmsSdk({
  origin: 'http://localhost:8080',
  cache: {
    custom: {
      getters: {
        find({ query, name }) {
          return store.getters[`${name}_find`](store.state)(query);
        },
        findOne({ query, name }) {
          return store.getters[`${name}_findOne`](store.state)(query);
        },
        items({ name }) {
          return store.getters[`${name}_items`](store.state);
        },
      },
      mutations: {
        remove({ payload, name }) {
          store.mutations[`${name}_remove`](store.state, payload);
        },
        set({ payload, name }) {
          store.mutations[`${name}_set`](store.state, payload);
        },
      },
    },
  },
});

export function Login(): void {
  it('should login user "Dev User"', async () => {
    await sdk.shim.verify.otp('');
    const isLoggedIn = await sdk.isLoggedIn();
    expect(isLoggedIn).to.be.a('boolean').to.equal(true);
  });
}
