import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';

export type StatePropsMunicipalFacilityField = {};
export type DispatchPropsMunicipalFacilityField = {
  dispatch: EtsDispatch,
};

export type OwnPropsMunicipalFacilityField = {
  error: string;
  disabled?: boolean;
  value: number | void;
  name?: string | void;
  clearable?: boolean;
  modalKey?: string;
  normatives: any[];
  missionAvailableRouteTypes?: string[];

  onChange: (changeObj: { [key: string]: any }) => any;

  page: string;
  path: string;
};

export type PropsMunicipalFacilityField = (
  StatePropsMunicipalFacilityField
  & DispatchPropsMunicipalFacilityField
  & OwnPropsMunicipalFacilityField
);

export type StateMunicipalFacilityField = {
  MUNICIPAL_FACILITY_OPTIONS: {
    value: number;
    label: string;
    mfData: MunicipalFacility;
  }[];
  myDisable: boolean;
};
