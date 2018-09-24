// дописать
export module GeoData {
  export type DT = {

  }
}

export interface GeozonesDataByIndex {
  front_key: string;
  company_id: number;
  shape: (Document | Node | ol.GlobalObject | string),
  frontIsSelected?: boolean;
};


export interface LoadGeozonesPromise {
  [type_geoobject: string]: GeozonesDataByIndex;
}

export type loadGeozonesFunc = (
  type: string,
  type_geoobject: string,
) => {
  type: string,
  payload: Promise<LoadGeozonesPromise>
  meta: {
    loading: boolean,
  }
}
