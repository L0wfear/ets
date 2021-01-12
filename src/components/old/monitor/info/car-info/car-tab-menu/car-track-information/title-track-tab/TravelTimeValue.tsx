import * as React from 'react';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { compose } from 'recompose';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import { filterValidPoints } from 'utils/track';

type PropsTravelTimeValue = {};

const convertSeconds = (timestamp: number) => { // timestamp - секунды, не unixtime
  let days, hours, minutes, seconds;
  seconds = timestamp;
  minutes = Math.floor(seconds / 60);
  hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  days = Math.floor(hours / 24);
  hours = hours % 24;

  if (days >= 1) {
    hours += 24 * days;
  }

  return `${hours}:${minutes}`;
};

export const getTimeValue = (track) => {
  let moveTimeInSeconds = null;
  if (track !== -1) {
    const filteredTrack = filterValidPoints(track);
    let speedIntervalList = []; // массив групп
    let speedGroup = []; // одна группа
    // Группируем точки трека, одна группа - это непрерывное движение ТС
    // т.е. когда speed_avg > 0
    // в одной группе должно быть 2 и более точек
    filteredTrack.forEach((elem) => {
      if (elem.speed_avg > 0) {
        speedGroup.push(elem);
      } else {
        if(speedGroup.length >= 2) {
          speedIntervalList.push(speedGroup);
        }
        speedGroup = [];
      }
    });

    moveTimeInSeconds = speedIntervalList.reduce((summator, current) => {
      const valueByGroup = current.reduce((acc, byGroupElem, i) => { // суммируем значения внутри одной группы
        if (byGroupElem.speed_avg > 0) {
          if (i === 0) {
            return acc;
          } else {
            return acc + (byGroupElem.timestamp - current[i - 1].timestamp); // timestamp в секундах
          }
        }
        return acc;
      }, 0);
      return summator + valueByGroup;
    }, 0);
  }

  return moveTimeInSeconds === null
    ? '---'
    : convertSeconds(moveTimeInSeconds);
};

const TravelTimeValue: React.FC<PropsTravelTimeValue> = () => {
  const track = etsUseSelector((state) => getMonitorPageState(state).carInfo.trackCaching.track);
  const [time, setTime] = React.useState(null);

  React.useEffect(() => {
    setTime(getTimeValue(track));
  }, [track]);

  return (
    <span>{time}</span>
  );
};

export default compose<PropsTravelTimeValue, {}>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'field',
    checkErrorPath: ['monitorPage', 'carInfo', 'trackCaching', 'error'],
    canNull: true,
  }),
)(TravelTimeValue);
