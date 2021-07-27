export function General() {
  return {
    async delay(time: number) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
  };
}
