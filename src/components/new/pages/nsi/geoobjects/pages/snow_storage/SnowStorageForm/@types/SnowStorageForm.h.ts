import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { SnowStorage, CreateSnowStorage, UpdateSnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsSnowStorageFormWrap = {
  showForm: boolean;
  element: SnowStorage | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsSnowStorageForm = {
  userData: InitialStateSession['userData'];
};
export type DispatchPropsSnowStorageForm = {
  createAction: CreateSnowStorage;
  updateAction: UpdateSnowStorage;
};
export type OwnPropsSnowStorageForm = {
  element: SnowStorage | null;
  handleHide: OnFormHideType
  page?: string;
  path?: string;
};

export type PropsSnowStorageFormWithForm = (
  StatePropsSnowStorageForm
  & DispatchPropsSnowStorageForm
  & OwnPropsSnowStorageForm
);

export type PropsSnowStorageForm = OutputWithFormProps<
  PropsSnowStorageFormWithForm,
  SnowStorage,
  [ SnowStorage ],
  any
>;
export type StateSnowStorageForm = {
};
