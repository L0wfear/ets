import { getAutobaseState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { createSelector, Selector } from 'reselect';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

export const getReasonListState = (state: ReduxState) => (
  getAutobaseState(state).tachographRepairReasonList
);

// for reselect
export type ReasonListStructure = ValuesOf<IStateAutobase['tachographRepairReasonList']>;

export type GetReasonListAns = (
  Array<DefaultSelectOption<ReasonListStructure['id'], ReasonListStructure['name'], ReasonListStructure>>
  );

export const getAutobaseReasonList: Selector<ReduxState, IStateAutobase['tachographRepairReasonList']> = (state) => (
  getAutobaseState(state).tachographRepairReasonList
);

export const getReasonList = createSelector<ReduxState, IStateAutobase['tachographRepairReasonList'], GetReasonListAns>(
  getAutobaseReasonList,
  (ReasonList) => ReasonList.map((reason) => ({
    value: reason.id,
    label: reason.name,
    rowData: reason,
  })),
);
