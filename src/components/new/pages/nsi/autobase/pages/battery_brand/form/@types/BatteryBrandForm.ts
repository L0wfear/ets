import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsBatteryBrandFormLazy = {
  element: Partial<BatteryBrand>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type OwnBatteryBrandProps = {
  element: Partial<BatteryBrand>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsBatteryBrandWithForm = (
  OwnBatteryBrandProps
);

export type PropsBatteryBrand = OutputWithFormProps<
  PropsBatteryBrandWithForm,
  BatteryBrand,
  [ BatteryBrand ],
  any
>;
