import { DispatchProp } from 'react-redux';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';

export type StatePropsTrHead = {
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  userData: InitialStateSession['userData'];
};
export type DispatchPropsTrHead = DispatchProp;
export type OwnPropsTrHead = {
  registryKey: string;
  thDataRow: any[];
};

export type PropsTrHead = (
  StatePropsTrHead
  & DispatchPropsTrHead
  & OwnPropsTrHead
);
export type StateTrHead = {};
