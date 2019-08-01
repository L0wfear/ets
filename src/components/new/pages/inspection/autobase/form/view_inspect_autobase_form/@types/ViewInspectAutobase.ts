import { InspectAutobase } from "redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase";
import { INSPECT_TYPE_FORM } from "components/new/pages/inspection/autobase/global_constants";

import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: any, result?: any) => void;

export type ViewInspectAutobaseStateProps = {};
export type ViewInspectAutobaseDispatchProps = {};
export type ViewInspectAutobaseOwnProps = {
  element: InspectAutobase;
  type: keyof typeof INSPECT_TYPE_FORM;
  handleHide: OnFormHideType;
  handleCloseWithoutChanges: any;

  loadingPage: string;
  page: string;
  path?: string;
};

type ViewInspectAutobaseMergedProps = (
  ViewInspectAutobaseStateProps
  & ViewInspectAutobaseDispatchProps
  & ViewInspectAutobaseOwnProps
) & {
  isPermittedToUpdateClose: boolean;
};

export type PropsViewInspectAutobaseWithForm = ViewInspectAutobaseMergedProps;

export type ViewInspectAutobaseProps = OutputWithFormProps<
  PropsViewInspectAutobaseWithForm,
  InspectAutobase,
  [ InspectAutobase ],
  any
>;
