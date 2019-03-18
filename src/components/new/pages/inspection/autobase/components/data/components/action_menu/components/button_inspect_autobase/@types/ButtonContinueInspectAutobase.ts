import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { IStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';

export type ButtonContinueInspectAutobaseStateProps = {
  lastConductingInspect: IStateInspectAutobase['lastConductingInspect'];
};
export type ButtonContinueInspectAutobaseDispatchProps = {
};
export type ButtonContinueInspectAutobaseOwnProps = {
};

export type ButtonContinueInspectAutobaseProps = (
  (
    ButtonContinueInspectAutobaseStateProps
    & ButtonContinueInspectAutobaseDispatchProps
    & ButtonContinueInspectAutobaseOwnProps
  )
  & WithSearchProps
);
