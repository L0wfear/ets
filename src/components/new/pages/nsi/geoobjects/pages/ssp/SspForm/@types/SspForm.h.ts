import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsSspFormWrap = {
  showForm: boolean;
  element: Ssp | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type OwnPropsSspForm = {
  element: Ssp | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsSspFormWithForm = (
  OwnPropsSspForm
);

export type PropsSspForm = OutputWithFormProps<
  PropsSspFormWithForm,
  Ssp
>;
