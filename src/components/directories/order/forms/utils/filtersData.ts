import { diffDates } from 'utils/dates.js';

export const getMissionListByFilter = (missionsList) => (
  missionsList.reduce((arr, m) => {
    if (m.date_to && diffDates(new Date(), m.date_to, 'minutes') < 0) {
      arr.push({
        ...m,
        customId: arr.length + 1,
      });
    }

    return arr;
  }, [])
);
