import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';

import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: any, result?: any) => void;

export type ViewInspectPgmBaseStateProps = {};
export type ViewInspectPgmBaseDispatchProps = {};
export type ViewInspectPgmBaseOwnProps = {
  element: InspectPgmBase;
  inspectIsActive: boolean;
  inspectIsClosed: boolean;
  type: keyof typeof INSPECT_TYPE_FORM;
  handleHide: OnFormHideType;
  handleCloseWithoutChanges: any;

  loadingPage: string;
  page: string;
  path?: string;
};

type ViewInspectPgmBaseMergedProps = (
  ViewInspectPgmBaseStateProps
  & ViewInspectPgmBaseDispatchProps
  & ViewInspectPgmBaseOwnProps
) & {
  isPermittedToUpdateClose: boolean;
};

export type PropsViewInspectPgmBaseWithForm = ViewInspectPgmBaseMergedProps;

export type ViewInspectPgmBaseProps = OutputWithFormProps<
  PropsViewInspectPgmBaseWithForm,
  InspectPgmBase,
  [ InspectPgmBase ],
  any
>;
