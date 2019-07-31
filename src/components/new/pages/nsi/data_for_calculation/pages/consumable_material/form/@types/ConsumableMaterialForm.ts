import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import { HandleThunkActionCreator } from 'react-redux';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsConsumableMaterialFormLazy = {
  element: Partial<ConsumableMaterial>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
} & WithSearchProps;

export type StatePropsConsumableMaterial = {};
export type DispatchPropsConsumableMaterial = {
  actionLoadMeasureUnit: HandleThunkActionCreator<typeof actionLoadMeasureUnit>;
};
export type OwnConsumableMaterialProps = {
  element: Partial<ConsumableMaterial>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsConsumableMaterialWithForm = (
  StatePropsConsumableMaterial
  & DispatchPropsConsumableMaterial
  & OwnConsumableMaterialProps
);

export type PropsConsumableMaterial = OutputWithFormProps<
  PropsConsumableMaterialWithForm,
  ConsumableMaterial,
  [ ConsumableMaterial ],
  any
>;
