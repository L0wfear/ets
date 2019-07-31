import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DispatchProp } from 'react-redux';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsBatteryManufacturerFormWrap = {
  element: Partial<BatteryManufacturer>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsBatteryManufacturer = {};
export type DispatchPropsBatteryManufacturer = DispatchProp;
export type OwnBatteryManufacturerProps = {
  element: Partial<BatteryManufacturer>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsBatteryManufacturerWithForm = (
  StatePropsBatteryManufacturer
  & DispatchPropsBatteryManufacturer
  & OwnBatteryManufacturerProps
);

export type PropsBatteryManufacturer = OutputWithFormProps<
  PropsBatteryManufacturerWithForm,
  BatteryManufacturer,
  [ BatteryManufacturer ],
  any
>;
