import { MissionSource } from 'redux-main/reducers/modules/some_uniq/mission_source/@types';
import { DefaultSelectListMapper, defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

export const makeOptionsByMissionSourceForMission = (
  missionSource: MissionSource[],
  selectedSourceIsOrder: boolean,
) => (
  missionSource.reduce((newArr: DefaultSelectListMapper<MissionSource>, missionSourceData) => {
    if (!selectedSourceIsOrder) {
      if (!missionSourceData.auto) {
        newArr.push(defaultSelectListMapper(missionSourceData));
      }
    } else {
      newArr.push(defaultSelectListMapper(missionSourceData));
    }

    return newArr;
  }, [])
);
