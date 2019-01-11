import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';

export type IStateGeoobject = {
  carpoolList: Carpool[];
  dtList: Dt[];
  odhList: Odh[];
  sspList: Ssp[];
  mspList: Msp[]
};
