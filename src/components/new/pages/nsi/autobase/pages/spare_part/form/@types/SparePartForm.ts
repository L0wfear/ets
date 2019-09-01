import { SparePart, MeasureUnit, SparePartGroup } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DefaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsSparePartFormLazy = {
  element: SparePart | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type OwnSparePartProps = {
  element: SparePart | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsSparePartWithForm = (
  OwnSparePartProps
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
  canSave: boolean;
};
