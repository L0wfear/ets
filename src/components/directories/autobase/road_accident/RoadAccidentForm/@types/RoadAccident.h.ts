import { RoadAccident, RoadAccidentCause } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DefaultSelectListMapper, DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import {
  AutobaseCreateRoadAccident,
  AutobaseUpdateRoadAccident,
} from 'redux-main/reducers/modules/autobase/actions_by_type/road_accident/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { GetRoadAccidentCauseType } from 'redux-main/reducers/modules/autobase/actions_by_type/road_accident_cause/@types';
import { GetDriver } from 'redux-main/reducers/modules/employee/driver/@types';
import { Driver } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsRoadAccidentFormWrap = {
  showForm: boolean;
  element: RoadAccident | null;
  car_id: number;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsRoadAccident = {
  userCompanyId: InitialStateSession['userData']['company_id'];
};
export type DispatchPropsRoadAccident = {
  createAction: AutobaseCreateRoadAccident;
  updateAction: AutobaseUpdateRoadAccident;
  autobaseGetAccidentCause: GetRoadAccidentCauseType;
  employeeDriverGetSetDriver: GetDriver;
};
export type OwnRoadAccidentProps = {
  element: RoadAccident | null;
  handleHide: OnFormHideType
  car_id: number;
  page?: string;
  path?: string;
};

export type PropsRoadAccidentWithForm = (
  StatePropsRoadAccident
  & DispatchPropsRoadAccident
  & OwnRoadAccidentProps
);

export type PropsRoadAccident = OutputWithFormProps<
  PropsRoadAccidentWithForm,
  RoadAccident,
  [ RoadAccident ],
  any
>;
export type StateRoadAccident = {
  roadAccidentCauseOptions: DefaultSelectListMapper<RoadAccidentCause>;
  driversOptions: DefaultSelectOption<Driver['id'], Driver['fio_license'], Driver>[];
};
