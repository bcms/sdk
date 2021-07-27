import type { BCMSDateUtility } from '../types';
import { useBcmsStringUtility } from './string';

const mod: {
  date: BCMSDateUtility;
} = {
  date: undefined as never,
};

export function createBcmsDateUtility(): void {
  const stringUtil = useBcmsStringUtility();
  mod.date = {
    prettyElapsedTimeSince(millis) {
      const timeDiff = Math.abs(Date.now() - millis);
      const days = parseInt(`${(timeDiff / 86400000).toFixed(1)}`);
      if (days > 10) {
        return mod.date.toReadable(millis);
      }
      const hours = parseInt(`${timeDiff / 3600000}`);
      const minutes = parseInt(`${timeDiff / 60000}`);
      if (days > 0) {
        return `${days} days ago`;
      } else if (hours > 0) {
        return `${hours} hours ago`;
      } else if (minutes > 0) {
        return `${minutes} minutes ago`;
      } else {
        return `just now`;
      }
    },
    toReadable(millis) {
      const months: string[] = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const date = new Date(millis);
      const minutes = date.getMinutes();
      const hours = date.getHours();
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      return `${day} ${months[month]}, ${year} ${stringUtil.addZerosAtBeginning(
        hours,
      )}:${stringUtil.addZerosAtBeginning(minutes)}`;
    },
  };
}

export function useDateUtility(): BCMSDateUtility {
  return mod.date;
}
