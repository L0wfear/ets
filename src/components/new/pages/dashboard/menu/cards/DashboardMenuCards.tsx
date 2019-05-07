import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { dashBoardResetData } from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import CurrentMissions from 'components/new/pages/dashboard/menu/cards/current-missions/CurrentMissions';
import FutureMissions from 'components/new/pages/dashboard/menu/cards/future-missions/FutureMissions';
import OdhNotCoveredByMissionsOfCurrentShift from 'components/new/pages/dashboard/menu/cards/odh-not-covered-by-missions-of-current-shift/OdhNotCoveredByMissionsOfCurrentShift';
import OdhNotCoveredByRoutes from 'components/new/pages/dashboard/menu/cards/odh-not-covered-by-routes/OdhNotCoveredByRoutes';
import OdhCoveredByRoutes from 'components/new/pages/dashboard/menu/cards/odh-covered-by-routes/OdhCoveredByRoutes';
import CarInWorkOverall from 'components/new/pages/dashboard/menu/cards/car-in-work-overall/CarInWorkOverall';
import Faxogramms from 'components/new/pages/dashboard/menu/cards/faxogramms/Faxogramms';
import CurrentDutyMissions from 'components/new/pages/dashboard/menu/cards/current-duty-missions/CurrentDutyMissions';
import WaybillDraft from 'components/new/pages/dashboard/menu/cards/waybill-draft/WaybillDraft';
import WaybillInProgress from 'components/new/pages/dashboard/menu/cards/waybill-in-progress/WaybillInProgress';
import WaybillCompleted from 'components/new/pages/dashboard/menu/cards/waybill-completed/WaybillCompleted';
import WaybillClosed from 'components/new/pages/dashboard/menu/cards/waybill-closed/WaybillClosed';

import { DashboardMenuCardsContainer } from 'components/new/pages/dashboard/menu/cards/styled/styled';

import { ReduxState } from 'redux-main/@types/state';

export type StatePropsDashboardMenuCards = {};

export type DispatchPropsDashboardMenuCards = {
  dashBoardResetData: HandleThunkActionCreator<typeof dashBoardResetData>;
};

export type OwnerPropsDashboardMenuCards = {
  page: string;
};

export type PropsDashboardMenuCards = (
  StatePropsDashboardMenuCards
  & DispatchPropsDashboardMenuCards
  & OwnerPropsDashboardMenuCards
);

export interface StateDashboardMenuCards {}

const DashboardMenuCards: React.FC<PropsDashboardMenuCards> = React.memo(
  (props) => {
    React.useEffect(
      () => {
        return () => props.dashBoardResetData();
      },
      [],
    );

    return (
      <DashboardMenuCardsContainer>
        <CurrentMissions timeDelay={0} timeInterval={60} page={props.page} />
        <FutureMissions timeDelay={1} />
        <OdhNotCoveredByMissionsOfCurrentShift timeDelay={2} />
        <OdhNotCoveredByRoutes timeDelay={3} />
        <OdhCoveredByRoutes timeDelay={4}/>
        <CarInWorkOverall timeDelay={5}/>
        <Faxogramms timeDelay={6} />
        <CurrentDutyMissions timeDelay={7} />
        <WaybillDraft timeDelay={8} />
        <WaybillInProgress timeDelay={9} />
        <WaybillCompleted timeDelay={10} />
        <WaybillClosed timeDelay={11} />
      </DashboardMenuCardsContainer>
    );
  },
);

export default connect<StatePropsDashboardMenuCards, DispatchPropsDashboardMenuCards, OwnerPropsDashboardMenuCards, ReduxState>(
  null,
  (dispatch) => ({
    dashBoardResetData: () => (
      dispatch(
        dashBoardResetData(),
      )
    ),
  }),
)
(DashboardMenuCards);
