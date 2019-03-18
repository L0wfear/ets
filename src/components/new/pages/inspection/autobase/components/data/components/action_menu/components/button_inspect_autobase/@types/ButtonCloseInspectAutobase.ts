import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { IStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { DispatchProp } from 'react-redux';

export type ButtonCloseInspectAutobaseStateProps = {
  lastConductingInspect: IStateInspectAutobase['lastConductingInspect'];
};
export type ButtonCloseInspectAutobaseDispatchProps = DispatchProp;

export type ButtonCloseInspectAutobaseOwnProps = {
};

export type ButtonCloseInspectAutobaseProps = (
  (
    ButtonCloseInspectAutobaseStateProps
    & ButtonCloseInspectAutobaseDispatchProps
    & ButtonCloseInspectAutobaseOwnProps
  )
  & WithSearchProps
);
