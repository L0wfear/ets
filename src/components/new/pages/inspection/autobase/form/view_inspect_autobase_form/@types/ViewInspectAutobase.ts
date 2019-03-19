import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';

export type ViewInspectAutobaseWrapOwnProps = {
  loadingPage: string;
  onFormHide: (isSubmitted: boolean, inspectAuotbase?: InspectAutobase) => any;
  selectedInspectAutobase: InspectAutobase;
};

export type ViewInspectAutobaseWrapProps = (
  WithSearchProps
  & ViewInspectAutobaseWrapOwnProps
  & {
    isPermitted: boolean;
  }
);

export type ViewInspectAutobaseStateProps = {
};
export type ViewInspectAutobaseDispatchProps = {
};
export type ViewInspectAutobaseOwnProps = {
  type: keyof typeof INSPECT_AUTOBASE_TYPE_FORM;
  selectedInspectAutobase: InspectAutobase;
  handleHide: (isSubmitted: boolean, inspectAuotbase?: InspectAutobase) => any;
  isPermitted: boolean;

  page: string;
};

export type ViewInspectAutobaseProps = (
  ViewInspectAutobaseStateProps
  & ViewInspectAutobaseDispatchProps
  & ViewInspectAutobaseOwnProps
);
