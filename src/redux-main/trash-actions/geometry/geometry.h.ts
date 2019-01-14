export interface GeozonesDataByIndex {
  front_key: string;
  front_id: string;
  company_id: number;
  shape: (Document | Node | ol.GlobalObject | string);
  frontIsSelected?: boolean;
  [key: string]: any;
}

export interface LoadGeozonesPromise {
  [type_geoobject: string]: GeozonesDataByIndex;
}

export type AnsLoadGeozonesFunc = {
  type: string,
  payload: Promise<LoadGeozonesPromise>
  meta: {
    loading: boolean,
  },
};

export type loadGeozonesFunc = (
  type: string,
  type_geoobject: string,
  meta?: any,
  company_id?: number | null,
) => AnsLoadGeozonesFunc;

export type OneGeozoneMunicipalFacility = {
  contractor_id: number;
  customer_id: number;
  geozone_type: string;
  id: number;
  name: string;
  shape: ol.GlobalObject;
  state: number;
};

export type GeozoneMunicipalFacility = OneGeozoneMunicipalFacility[];

export type GeozoneMunicipalFacilityById = {
  [id: string]: OneGeozoneMunicipalFacility;
};
