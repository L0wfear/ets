import { FutureMissionsItemsByTypeType } from "components/dashboard/redux-main/modules/dashboard/@types/future-mission.h";

export interface PropsCollapseListFutureMission {
  handleClick: (id: number) => any;
  collapsetItems: FutureMissionsItemsByTypeType[];
}

export interface StateCollapseListFutureMission {};
