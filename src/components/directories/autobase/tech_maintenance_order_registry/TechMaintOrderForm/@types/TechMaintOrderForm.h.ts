import { TechMaintOrder, IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
// import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

import {
  AutobaseCreateTechMaintOrder,
  AutobaseUpdateTechMaintOrder,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint_order/@types';

import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsTechMaintOrderFormWrap = {
  showForm: boolean;
  element: TechMaintOrder | null;
  car_id: number;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsTechMaintOrder = {
  techMaintTypeList: IStateAutobase['techMaintTypeList'];
  measureUnitRunList: IStateAutobase['measureUnitRunList'];
  specialModelList: IStateSomeUniq['specialModelList'];
};
export type DispatchPropsTechMaintOrder = {
  createAction: AutobaseCreateTechMaintOrder;
  updateAction: AutobaseUpdateTechMaintOrder;
  techMaintTypeGetAndSetInStore: () => any;
  measureUnitRunGetAndSetInStore: (tech_maintenance_type_id: TechMaintOrder['tech_maintenance_type_id']) => any;
  actionGetAndSetInStoreSpecialModel: () => any;
};
export type OwnTechMaintOrderProps = {
  element: TechMaintOrder | null;
  handleHide: OnFormHideType
  car_id: number;
  page?: string;
  path?: string;
};

export type PropsTechMaintOrderWithForm = (
  StatePropsTechMaintOrder
  & DispatchPropsTechMaintOrder
  & OwnTechMaintOrderProps
);

export type PropsTechMaintOrder = OutputWithFormProps<
  PropsTechMaintOrderWithForm,
  TechMaintOrder,
  [ TechMaintOrder ],
  any
>;
//  carListOptions: DefaultSelectListMapper<Car['asuods_id'], Car['gov_number'], Car>;
export type StateTechMaintOrder = {
};
