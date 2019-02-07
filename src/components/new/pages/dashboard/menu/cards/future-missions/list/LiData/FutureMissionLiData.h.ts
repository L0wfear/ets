import { FutureMissionsItemsByTypeType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/future-mission.h';

export interface PropsFutureMissionLiData {
  item: FutureMissionsItemsByTypeType;
  handleClick: (id: number) => any;
}

export interface StateFutureMissionLiData {}
