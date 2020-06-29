import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { createSelector, Selector } from 'reselect';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

export const getReasonOptionState = (state: ReduxState) => (
  getSomeUniqState(state).reasonOption
);

// for reselect
export type ReasonOptionStructure = ValuesOf<IStateSomeUniq['reasonOption']>;

export type GetReasonOptionAns = (
  Array<DefaultSelectOption<ReasonOptionStructure['id'], ReasonOptionStructure['name'], ReasonOptionStructure>>
);

export const getSomeUniqReasonOption: Selector<ReduxState, IStateSomeUniq['reasonOption']> = (state) => (
  getSomeUniqState(state).reasonOption
);

export const getReasonOption = createSelector<ReduxState, IStateSomeUniq['reasonOption'], GetReasonOptionAns>(
  getSomeUniqReasonOption,
  (ReasonOption) => ReasonOption.map((reason) => ({
    value: reason.id,
    label: reason.name,
    rowData: reason,
  })),
);
