import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';

export type ButtonShowTableFormStateProps = {
  lastConductingInspect: InspectAutobase;
  permissions: string | boolean;
};
export type ButtonShowTableFormDispatchProps = {
};
export type ButtonShowTableFormOwnProps = {
  loadingPage: string;
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
