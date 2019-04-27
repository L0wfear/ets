import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';

export type ViewInspectPgmBaseWrapOwnProps = {
  loadingPage: string;
  onFormHide: (isSubmitted: boolean, inspectAuotbase?: InspectPgmBase) => any;
  selectedInspect: InspectPgmBase;
};

export type ViewInspectPgmBaseWrapProps = (
  WithSearchProps
  & ViewInspectPgmBaseWrapOwnProps
  & {
    isPermitted: boolean;
  }
);

export type ViewInspectPgmBaseStateProps = {
};
export type ViewInspectPgmBaseDispatchProps = {
};
export type ViewInspectPgmBaseOwnProps = {
  type: keyof typeof INSPECT_PGM_BASE_TYPE_FORM;
  selectedInspect: InspectPgmBase;
  handleHide: (isSubmitted: boolean, inspectAuotbase?: InspectPgmBase) => any;
  isPermitted: boolean;

  loadingPage: string;
  page: string;
};

export type ViewInspectPgmBaseProps = (
  ViewInspectPgmBaseStateProps
  & ViewInspectPgmBaseDispatchProps
  & ViewInspectPgmBaseOwnProps
);
