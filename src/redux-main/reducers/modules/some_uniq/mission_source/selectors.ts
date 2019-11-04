import { createSelector, Selector } from 'reselect';
import { ReduxState } from 'redux-main/@types/state';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { MissionSource } from 'redux-main/reducers/modules/some_uniq/mission_source/@types';
import { DefaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';

export const getSomeUniqMissionSourceList: Selector<ReduxState, IStateSomeUniq['missionSource']['list']> = (state) => (
  getSomeUniqState(state).missionSource.list
);

export const selectorGetMissionSourceOptionsWithoutOrder = createSelector<ReduxState, ReturnType<typeof getSomeUniqMissionSourceList>, DefaultSelectListMapper<MissionSource>>(
  getSomeUniqMissionSourceList,
  (missionSourceList) => (
    missionSourceList
      .filter(({ auto }) => !auto) // auto как slug order
      .map(defaultSelectListMapper)
  ),
);

export const selectorGetMissionSourceOptions = createSelector<ReduxState, ReturnType<typeof getSomeUniqMissionSourceList>, DefaultSelectListMapper<MissionSource>>(
  getSomeUniqMissionSourceList,
  (missionSourceList) => (
    missionSourceList
      .map(defaultSelectListMapper)
  ),
);
