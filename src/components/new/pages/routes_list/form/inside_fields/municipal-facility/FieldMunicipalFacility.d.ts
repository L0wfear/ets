type GetMunicipalFacilityFuncProps = {
  start_date: any,
  end_date: any,
  kind_task_ids?: number[],
  norm_ids: string;
};

type MunicipalFacilityNormative = {};

type MunicipalFacilityType = {
  municipal_facility_id: number;
  municipal_facility_name: string;
  normatives: MunicipalFacilityNormative[];
  car_func_types: {
    id: number;
  }[];
  route_types: any[];
};

type GetMunicipalFacilityFuncAns = {
  payload: {
    municipal_facility_list: MunicipalFacilityType[];
  };
};

type GetMunicipalFacilityFunc = (props: GetMunicipalFacilityFuncProps) => Promise<GetMunicipalFacilityFuncAns>;

export type StatePropsMunicipalFacilityField = {};
export type DispatchPropsMunicipalFacilityField = {
  getCleaningMunicipalFacilityList: GetMunicipalFacilityFunc,
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
    mfData: MunicipalFacilityType;
  }[];
  myDisable: boolean;
};
