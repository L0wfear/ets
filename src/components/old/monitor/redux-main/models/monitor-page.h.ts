import { GeozonesDataByIndex } from 'redux-main/trash-actions/geometry/geometry.h';

export type FrontGeozonesDataByIndex = GeozonesDataByIndex & {
  front_show: boolean;
  front_add_at: any;
};

type SelectedGeoobjectsByserverName = {
  [id: string]: FrontGeozonesDataByIndex;
};
export type TypeSelectedGeoobjects = {
  [serverName: string]: SelectedGeoobjectsByserverName;
};
export type GeoobjsFilterByElem = {[key: number]: Array<number>;};
export type GeoobjsFilterByElemArr = Array<GeoobjsFilterByElem>;
