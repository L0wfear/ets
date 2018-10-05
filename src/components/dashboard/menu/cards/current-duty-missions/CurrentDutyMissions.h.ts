import {
  CurrentDutyMissionsItemsType,
  CurrentDutyMissionsItemsSubItemDatasType,
} from 'components/dashboard/redux/modules/dashboard/@types/current-duty-mission.h';


export type PropsCurrentDutyMissions = {
  items: CurrentDutyMissionsItemsType[];
  loadRouteDataById: (
    duty_mission_data: CurrentDutyMissionsItemsSubItemDatasType,
    duty_mission_route_id: number,
  ) => any;
}

export type StateCurrentDutyMissions = {
};
