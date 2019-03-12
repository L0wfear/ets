import {
  FutureMissionsFormDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/future-mission.h';

import { OwnerPropsDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';
import { HandleThunkActionCreator } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';

export type StateFutureMissions = {
  showMissionForm: boolean;
  elementMissionForm: FutureMissionsFormDataType;
};

export interface StatePropsFutureMissions {}

export interface DispatchPropsFutureMissions {
  actionGetMissionById: HandleThunkActionCreator<typeof missionsActions.actionGetMissionById>;
}

export interface OwnPropsFutureMissions {}

export type PropsFutureMissions = (
  StateFutureMissions
  & DispatchPropsFutureMissions
  & OwnPropsFutureMissions
);

export type OutterPropsFutureMissions<P> = OwnerPropsDefaultCard<P>;
