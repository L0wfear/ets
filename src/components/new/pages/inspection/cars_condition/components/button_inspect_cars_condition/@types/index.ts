import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';

export type ButtonShowTableFormStateProps = {
  lastConductingInspect: InspectAutobase;
  permissions: Parameters<typeof validatePermissions>[0];
};
export type ButtonShowTableFormDispatchProps = {
};
export type ButtonShowTableFormOwnProps = {
  loadingPage: string;
  showCreateBtn: boolean;
};

export type ButtonShowTableFormMergedProps = (
  ButtonShowTableFormStateProps
  & ButtonShowTableFormDispatchProps
  & ButtonShowTableFormOwnProps
);

export type ButtonShowTableFormProps = (
  ButtonShowTableFormMergedProps
  & WithSearchProps
  & {
    isPermitted: boolean;
  }
);
