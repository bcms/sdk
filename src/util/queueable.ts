export interface QueueableItem {
  resolve: (value: any) => void;
  reject: (value: any) => void;
}

export interface QueueableQueue {
  [key: string]: {
    open: boolean;
    list: QueueableItem[];
  };
}

export interface QueueablePrototype<T> {
  queue: QueueableQueue;
  freeQueue(key: string, type: 'resolve' | 'reject', value: any): void;
  nextInQueue(key: string, type: 'resolve' | 'reject'): void;
  exec(
    key: string,
    type: 'first_done_free_all' | 'free_one_by_one',
    executable: () => Promise<T>,
  ): Promise<T>;
}

export function Queueable<T>(...queueable): QueueablePrototype<T> {
  const queue: QueueableQueue = {};
  for (const i in queueable) {
    queue[queueable[i]] = {
      open: false,
      list: [],
    };
  }
  return {
    queue,
    freeQueue(key, type, value) {
      queue[key].open = false;
      while (queue[key].list.length !== 0) {
        queue[key].list.pop()[type](value);
      }
    },
    nextInQueue(key, type) {
      if (queue[key].list.length === 0) {
        queue[key].open = false;
      } else {
        queue[key].list.pop()[type](null);
      }
    },
    async exec(
      key,
      type,
      executable,
    ) {
      if (queue[key].open === true) {
        const output: any = await new Promise<T>((resolve, reject) => {
          queue[key].list.push({
            reject,
            resolve,
          });
        });
        if (type === 'first_done_free_all') {
          return output;
        }
      }
      queue[key].open = true;
      let result: T;
      try {
        result = await executable();
      } catch (error) {
        if (type === 'free_one_by_one') {
          this.nextInQueue(key, 'reject');
        } else {
          this.freeQueue(key, 'reject', error);
        }
        throw error;
      }
      if (type === 'free_one_by_one') {
        this.nextInQueue(key, 'resolve');
      } else {
        this.freeQueue(key, 'resolve', result);
      }
      return result;
    },
  };
}
