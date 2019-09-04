import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsSnowStorageFormWrap = {
  showForm: boolean;
  element: SnowStorage | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type OwnPropsSnowStorageForm = {
  element: SnowStorage | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsSnowStorageFormWithForm = (
  OwnPropsSnowStorageForm
);

export type PropsSnowStorageForm = OutputWithFormProps<
  PropsSnowStorageFormWithForm,
  SnowStorage,
  [ SnowStorage ],
  any
>;
