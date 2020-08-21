import { BCMS } from '../../src';
import { expect } from 'chai';

export const sdk = BCMS({
  cms: {
    origin: 'http://localhost:1280',
  },
});

export function Login() {
  it('should login user "test@test.com"', async () => {
    await sdk.user.login('test@test.com', 'password1234');
    const isLoggedIn = await sdk.isLoggedIn();
    expect(isLoggedIn).to.be.a('boolean').to.equal(true);
  });
}
