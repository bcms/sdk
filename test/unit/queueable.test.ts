import { Queueable } from '../../src/util';
import { ObjectUtil } from '../util';

const ou = ObjectUtil();
const queueable = Queueable<string>('fdfa', 'fobo');
const Tester = {
  fdfa: async (name: string) => {
    return await queueable.exec('fdfa', 'first_done_free_all', async () => {
      await delay(100);
      return name;
    });
  },
  fobo: async (name: string) => {
    return await queueable.exec('fobo', 'free_one_by_one', async () => {
      await delay(100);
      return name;
    });
  },
};
async function delay(time: number) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

describe('Queueable', async () => {
  it('should test fdfa', (done) => {
    const buffer: string[] = [];
    const ppc = 4;
    function checkDone() {
      if (buffer.length === ppc) {
        try {
          ou.eq(buffer, ['test0', 'test0', 'test0', 'test0'], 'buffer');
          done();
        } catch (error) {
          done(error);
        }
      }
    }
    for (let i = 0; i < ppc; i = i + 1) {
      Tester.fdfa(`test${i}`).then((result) => {
        buffer.push(result);
        checkDone();
      });
    }
  });
  it('should test fobo', (done) => {
    const buffer: string[] = [];
    const ppc = 4;
    function checkDone() {
      if (buffer.length === ppc) {
        try {
          ou.eq(buffer, ['test0', 'test3', 'test2', 'test1'], 'buffer');
          done();
        } catch (error) {
          done(error);
        }
      }
    }
    for (let i = 0; i < ppc; i = i + 1) {
      Tester.fobo(`test${i}`).then((result) => {
        buffer.push(result);
        checkDone();
      });
    }
  });
});
