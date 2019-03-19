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

export type IStateMissions = {
  missionTemplateList: MissionTemplate[];
  carForMissionTemplateList: Car[];
  carForMissionTemplateIndex: Record<Car['asuods_id'], Car>;
  dutyMissionTemplateList: DutyMissionTemplate[];

  dutyMissionData: {
    dutyMissionList: DutyMission[],
    availableMissionsToBind: Mission[];
    dependeceOrder: Order;
    dependeceTechnicalOperation: OrderTechnicalOperation;
    total_count: number;
  };
  missionData: {
    list: Mission[];
    waybillData: Waybill;
    dependeceOrder: Order;
    dependeceTechnicalOperation: OrderTechnicalOperation;
    carsList: Car[];
    carsIndex: Record<Car['asuods_id'], Car>;
    total_count: number;
  };
};
