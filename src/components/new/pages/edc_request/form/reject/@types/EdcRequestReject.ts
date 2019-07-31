import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';
import { HandleThunkActionCreator } from 'react-redux';
import edcRequestActions from 'redux-main/reducers/modules/edc_request/edc_request_actions';

export type EdcRequestReject = {
  id: EdcRequest['id'],
  rejection_reason_id: number;
  rejection_reason_name: string;
};

export type EdcRequestRejectFormLazyProps = {
  showForm: boolean;
  element: Partial<EdcRequestReject>;

  edcReques: EdcRequest;
  onFormHide: OnFormHideType;
  readOnly?: boolean;
  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type EdcRequestRejectFormStateProps = {
};

export type EdcRequestRejectFormDispatchProps = {
  actionLoadRejectionReason: HandleThunkActionCreator<typeof edcRequestActions.actionLoadRejectionReason>;
};
export type EdcRequestRejectFormOwnProps = {
  element: Partial<EdcRequestReject>;

  edcReques: EdcRequest;
  handleHide: OnFormHideType;
  readOnly?: boolean;
  page: string;
  path?: string;
};

export type EdcRequestRejectFormPropsWithForm = (
  EdcRequestRejectFormStateProps
  & EdcRequestRejectFormDispatchProps
  & EdcRequestRejectFormOwnProps
);

export type EdcRequestRejectFormProps = OutputWithFormProps<
  EdcRequestRejectFormPropsWithForm,
  EdcRequestReject,
  any,
  any
>;
export type State = {};
