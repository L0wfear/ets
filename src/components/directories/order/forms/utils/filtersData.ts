import { diffDates } from 'utils/dates';

export const getMissionListByFilter = (missionsList) => (
  missionsList.reduce((arr, m) => {
    if (m.date_to && diffDates(new Date(), m.date_to, 'minutes') < 0) {
      arr.push({
        ...m,
        frontId: arr.length + 1,
      });
    }

    return arr;
  }, [])
);
