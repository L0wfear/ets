// дописать
export module GeoData {
  export type DT = {

  }
}

export interface GeozonesDataByIndex {
  front_key: string;
  front_id: string;
  company_id: number;
  shape: (Document | Node | ol.GlobalObject | string),
  frontIsSelected?: boolean;
};


export interface LoadGeozonesPromise {
  [type_geoobject: string]: GeozonesDataByIndex;
}

export type AnsLoadGeozonesFunc = {
  type: string,
  payload: Promise<LoadGeozonesPromise>
  meta: {
    loading: boolean,
  }
};

export type loadGeozonesFunc = (
  type: string,
  type_geoobject: string,
  meta?: any,
  company_id?: number | null,
) => AnsLoadGeozonesFunc;
