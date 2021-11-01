import { expect } from 'chai';
import { createBcmsSdk } from '../../src';
import { store } from '../../src/dev/store';

export const sdk = createBcmsSdk({
  origin: 'http://localhost:8080',
  cache: {
    getters: {
      find({ query, name }) {
        return store.getters[`${name}_find`](store.state)(query as any) as any[];
      },
      findOne({ query, name }) {
        return store.getters[`${name}_findOne`](store.state)(
          query as any,
        ) as any;
      },
      items({ name }) {
        return store.getters[`${name}_items`](store.state) as any[];
      },
    },
    mutations: {
      remove({ payload, name }) {
        store.mutations[`${name}_remove`](store.state, payload as any);
      },
      set({ payload, name }) {
        store.mutations[`${name}_set`](store.state, payload as any);
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
