import { createBcmsSdk } from '../main';
import { store } from './store';

(window as any).sdk = createBcmsSdk({
  origin: 'http://localhost:8080',
  cache: {
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
});
