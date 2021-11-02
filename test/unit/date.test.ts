import { expect } from 'chai';
import { createBcmsDateUtility, createBcmsStringUtility } from '../../src';

const stringUtil = createBcmsStringUtility();
const dateUtil = createBcmsDateUtility({
  stringUtil,
});

describe('Date utility', async () => {
  it('should check if prettyElapsedTimeSince output is "just now"', async () => {
    const result = dateUtil.prettyElapsedTimeSince(Date.now());
    expect(result).to.be.eq('just now');
  });
  it('should check if prettyElapsedTimeSince output is "2 minutes ago"', async () => {
    const result = dateUtil.prettyElapsedTimeSince(Date.now() - 120000);
    expect(result).to.be.eq('2 minutes ago');
  });
  it('should check if prettyElapsedTimeSince output is "2 hours ago"', async () => {
    const result = dateUtil.prettyElapsedTimeSince(Date.now() - 7200000);
    expect(result).to.be.eq('2 hours ago');
  });
  it('should check if prettyElapsedTimeSince output is "2 days ago"', async () => {
    const result = dateUtil.prettyElapsedTimeSince(Date.now() - 172800000);
    expect(result).to.be.eq('2 days ago');
  });
});
