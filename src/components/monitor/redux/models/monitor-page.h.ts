import { GeozonesDataByIndex } from 'redux/trash-actions/geometry/geometry.h';

export type FrontGeozonesDataByIndex = GeozonesDataByIndex & {
  front_show: boolean;
  front_add_at: any;
}

interface selectedGeoobjectsByserverName {
  [id: string]: FrontGeozonesDataByIndex;
}
export type TypeSelectedGeoobjects = {
  [serverName: string]: selectedGeoobjectsByserverName;
}