import {
  RoadAccident,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { GetRoadAccidentCauseType } from 'redux-main/reducers/modules/autobase/actions_by_type/road_accident_cause/@types';
import { GetDriver } from 'redux-main/reducers/modules/employee/driver/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsRoadAccidentFormLazy = {
  element: RoadAccident | null;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsRoadAccident = {
  userCompanyId: InitialStateSession['userData']['company_id'];
};
export type DispatchPropsRoadAccident = {
  autobaseGetAccidentCause: GetRoadAccidentCauseType;
  employeeDriverGetSetDriver: GetDriver;
};
export type OwnRoadAccidentProps = {
  element: RoadAccident | null;
  handleHide: OnFormHideType;

  page: string;
  path?: string;
};

export type PropsRoadAccidentWithForm = (
  StatePropsRoadAccident
  & DispatchPropsRoadAccident
  & OwnRoadAccidentProps
) & WithSearchProps;

export type PropsRoadAccident = OutputWithFormProps<
  PropsRoadAccidentWithForm,
  RoadAccident,
  [RoadAccident],
  any
>;
