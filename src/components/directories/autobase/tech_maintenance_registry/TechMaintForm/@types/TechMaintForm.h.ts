import { TechMaint, IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
// import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

import {
  AutobaseCreateTechMaint,
  AutobaseUpdateTechMaint,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint/@types';

import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsTechMaintFormWrap = {
  showForm: boolean;
  element: TechMaint | null;
  car_id: number;
  car_model_id: number;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsTechMaint = {
  repairCompanyList: IStateAutobase['repairCompanyList'];
  techMaintOrderList: IStateAutobase['techMaintOrderList'];
};
export type DispatchPropsTechMaint = {
  createAction: AutobaseCreateTechMaint;
  updateAction: AutobaseUpdateTechMaint;
  techMaintOrderGetAndSetInStore: any;
  repairCompanyGetAndSetInStore: any
};
export type OwnTechMaintProps = {
  element: TechMaint | null;
  handleHide: OnFormHideType
  car_id: number;
  car_model_id: number;
  page?: string;
  path?: string;
};

export type PropsTechMaintWithForm = (
  StatePropsTechMaint
  & DispatchPropsTechMaint
  & OwnTechMaintProps
);

export type PropsTechMaint = OutputWithFormProps<
  PropsTechMaintWithForm,
  TechMaint,
  [ TechMaint ],
  any
>;
//  carListOptions: DefaultSelectListMapper<Car['asuods_id'], Car['gov_number'], Car>;
export type StateTechMaint = {
};
