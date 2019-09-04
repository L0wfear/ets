import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsFountainsFormWrap = {
  showForm: boolean;
  element: Fountains | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type OwnPropsFountainsForm = {
  element: Fountains | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsFountainsFormWithForm = (
  OwnPropsFountainsForm
);

export type PropsFountainsForm = OutputWithFormProps<
  PropsFountainsFormWithForm,
  Fountains,
  [ Fountains ],
  any
>;
