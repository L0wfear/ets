import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import {
  Order,
  OrderTechnicalOperation,
} from 'redux-main/reducers/modules/order/@types';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { EdcRequest } from '../../edc_request/@types';

export type IStateMissions = {
  missionTemplateList: Array<MissionTemplate>;
  carForMissionTemplateList: Array<Car>;
  carForMissionTemplateIndex: Record<Car['asuods_id'], Car>;
  dutyMissionTemplateList: Array<DutyMissionTemplate>;

  dutyMissionData: {
    dutyMissionList: Array<DutyMission>;
    availableMissionsToBind: Array<Mission>;
    edcRequest: EdcRequest;
    dependeceOrder: Order;
    dependeceTechnicalOperation: OrderTechnicalOperation;
    total_count: number;
  };
  missionData: {
    list: Array<Mission>;
    waybillData: Waybill;
    dependeceOrder: Order;
    dependeceTechnicalOperation: OrderTechnicalOperation;
    edcRequest: EdcRequest;
    carsList: Array<Car>;
    carsIndex: Record<Car['asuods_id'], Car>;
    total_count: number;
  };
};
