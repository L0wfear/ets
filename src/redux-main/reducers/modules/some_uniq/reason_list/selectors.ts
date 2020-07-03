import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { createSelector, Selector } from 'reselect';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

export const getReasonListState = (state: ReduxState) => (
  getSomeUniqState(state).reasonList
);

// for reselect
export type ReasonListStructure = ValuesOf<IStateSomeUniq['reasonList']>;

export type GetReasonListAns = (
  Array<DefaultSelectOption<ReasonListStructure['id'], ReasonListStructure['name'], ReasonListStructure>>
);

export const getSomeUniqReasonList: Selector<ReduxState, IStateSomeUniq['reasonList']> = (state) => (
  getSomeUniqState(state).reasonList
);

export const getReasonList = createSelector<ReduxState, IStateSomeUniq['reasonList'], GetReasonListAns>(
  getSomeUniqReasonList,
  (ReasonList) => ReasonList.map((reason) => ({
    value: reason.id,
    label: reason.name,
    rowData: reason,
  })),
);
