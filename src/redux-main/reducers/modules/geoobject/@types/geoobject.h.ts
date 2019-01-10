import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';

export type IStateGeoobject = {
  carpoolList: Carpool[];
  dtList: Dt[];
};
