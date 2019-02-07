import {
  GEOOBJECT_SET_DATA,
} from 'redux-main/reducers/modules/geoobject/geoobject';
import { IStateGeoobject } from 'redux-main/reducers/modules/geoobject/@types/geoobject.h';

export const geoobjectSetNewData = (newStateData: { [K in keyof IStateGeoobject]?: IStateGeoobject[K] }) => ({
  type: GEOOBJECT_SET_DATA,
  payload: newStateData,
});
