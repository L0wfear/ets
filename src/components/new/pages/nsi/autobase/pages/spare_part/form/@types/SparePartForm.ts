import { SparePart, MeasureUnit, SparePartGroup } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DefaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsSparePartWithForm = WithFormRegistrySearchAddProps<SparePart>;

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
