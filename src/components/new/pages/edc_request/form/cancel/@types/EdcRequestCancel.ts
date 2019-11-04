import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';

export type EdcRequestCancel = {
  id: EdcRequest['id'];
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

export type EdcRequestCancelFormPropsWithForm = {
  element: Partial<EdcRequestCancel>;

  edcReques: EdcRequest;
  handleHide: OnFormHideType;
  readOnly?: boolean;
  page: string;
  path?: string;
};

export type EdcRequestCancelFormProps = OutputWithFormProps<
  EdcRequestCancelFormPropsWithForm,
  EdcRequestCancel,
  any,
  any
>;
export type State = {};
