import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

export type ButtonContinueInspectAutobaseStateProps = {
  lastConductingInspect: InspectAutobase;
  permissions: OneRegistryData['list']['permissions']['update'];
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
