import { DispatchProp } from 'react-redux';
// import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
// import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type StatePropsTrHead = {
  // STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  // userData: InitialStateSession['userData'];
  permissionsSet: InitialStateSession['userData']['permissionsSet'];
};
export type DispatchPropsTrHead = DispatchProp;
export type OwnPropsTrHead = {
  registryKey: string;
  thDataRow: any[];
};

export type MergedPropsTrHead = (
  StatePropsTrHead
  & DispatchPropsTrHead
  & OwnPropsTrHead
);

export type PropsTrHead = (
  MergedPropsTrHead
  & WithSearchProps
);

export type StateTrHead = {};
