import { SparePart, MeasureUnit, SparePartGroup } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { GetMeasureUnit } from 'redux-main/reducers/modules/autobase/actions_by_type/measure_unit/@types';
import { GetSparePartGroup } from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part_group/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsSparePartFormLazy = {
  element: SparePart | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsSparePart = {};
export type DispatchPropsSparePart = {
  autobaseGetSetMeasureUnit: GetMeasureUnit;
  autobaseGetSetSparePartGroup: GetSparePartGroup;
};
export type OwnSparePartProps = {
  element: SparePart | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsSparePartWithForm = (
  StatePropsSparePart
  & DispatchPropsSparePart
  & OwnSparePartProps
);

export type PropsSparePart = OutputWithFormProps<
  PropsSparePartWithForm,
  SparePart,
  [ SparePart ],
  any
>;
export type StateSparePart = {
  measureUnitOptions: DefaultSelectListMapper<MeasureUnit>;
  sparePartGroupOptions: DefaultSelectListMapper<SparePartGroup>;
};
