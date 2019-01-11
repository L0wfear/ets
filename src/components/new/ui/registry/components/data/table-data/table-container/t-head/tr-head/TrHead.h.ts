import { DispatchProp } from 'react-redux';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type StatePropsTrHead = {
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
