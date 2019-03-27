import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';
import { HandleThunkActionCreator } from 'react-redux';
import edcRequestActions from 'redux-main/reducers/modules/edc_request/edc_request_actions';

export type EdcRequestCancel = {
  id: EdcRequest['id'],
  cancel_reason_id: number;
  cancel_reason_name: string;
};

export type EdcRequestCancelFormLazyProps = {
  showForm: boolean;
  element: Partial<EdcRequestCancel>;

  edcReques: EdcRequest;
  onFormHide: OnFormHideType;
  readOnly?: boolean;
  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type EdcRequestCancelFormStateProps = {
};

export type EdcRequestCancelFormDispatchProps = {
  actionLoadRefusalReason: HandleThunkActionCreator<typeof edcRequestActions.actionLoadRefusalReason>;
};
export type EdcRequestCancelFormOwnProps = {
  element: Partial<EdcRequestCancel>;

  edcReques: EdcRequest;
  handleHide: OnFormHideType;
  readOnly?: boolean;
  page: string;
  path?: string;
};

export type EdcRequestCancelFormPropsWithForm = (
  EdcRequestCancelFormStateProps
  & EdcRequestCancelFormDispatchProps
  & EdcRequestCancelFormOwnProps
);

export type EdcRequestCancelFormProps = OutputWithFormProps<
  EdcRequestCancelFormPropsWithForm,
  EdcRequestCancel,
  any,
  any
>;
export type State = {};
