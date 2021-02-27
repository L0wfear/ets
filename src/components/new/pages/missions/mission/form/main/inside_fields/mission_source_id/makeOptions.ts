import { MissionSource } from 'redux-main/reducers/modules/some_uniq/mission_source/@types';
import { DefaultSelectListMapper, defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';

export const makeOptionsByMissionSourceForMission = (
  missionSource: Array<MissionSource>,
) => (
  missionSource.reduce((newArr: DefaultSelectListMapper<MissionSource>, missionSourceData) => {
    newArr.push(defaultSelectListMapper(missionSourceData));

    return newArr;
  }, [])
);
