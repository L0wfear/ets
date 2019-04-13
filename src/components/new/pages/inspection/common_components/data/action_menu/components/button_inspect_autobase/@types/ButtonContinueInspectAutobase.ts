import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';

export type ButtonContinueInspectAutobaseStateProps = {
  lastConductingInspect: InspectAutobase;
  permissions: string | boolean;
};
export type ButtonContinueInspectAutobaseDispatchProps = {
};
export type ButtonContinueInspectAutobaseOwnProps = {
  loadingPage: string;
};

export type ButtonContinueInspectAutobaseMergedProps = (
  ButtonContinueInspectAutobaseStateProps
  & ButtonContinueInspectAutobaseDispatchProps
  & ButtonContinueInspectAutobaseOwnProps
);

export type ButtonContinueInspectAutobaseProps = (
  ButtonContinueInspectAutobaseMergedProps
  & WithSearchProps
);
