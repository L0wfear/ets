import {
  FutureMissionsFormDataType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/future-mission.h';

import { MissionType } from 'redux-main/trash-actions/mission/@types/promise-mission.h';
import { OwnerPropsDefaultCard } from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

export type StateFutureMissions = {
  showMissionFormWrap: boolean;
  elementMissionFormWrap: FutureMissionsFormDataType;
};

export interface StatePropsFutureMissions {}

export interface DispatchPropsFutureMissions {
  getMissionById: (id: number) => Promise<MissionType>;
}

export interface OwnPropsFutureMissions {}

export type PropsFutureMissions = (
  StateFutureMissions
  & DispatchPropsFutureMissions
  & OwnPropsFutureMissions
);

export type OutterPropsFutureMissions<P> = OwnerPropsDefaultCard<P>;
