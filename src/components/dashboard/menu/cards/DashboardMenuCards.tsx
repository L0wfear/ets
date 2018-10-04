import * as React from 'react';
import { connect } from 'react-redux';
import { dashBoardResetData } from 'components/dashboard/redux-main/modules/dashboard/actions-dashboard';

import CurrentMissions from 'components/dashboard/menu/cards/current-missions/CurrentMissions';
import FutureMissions from 'components/dashboard/menu/cards/future-missions/FutureMissions';

import OdhNotCoveredByMissionsOfCurrentShift from 'components/dashboard/menu/cards/odh-not-covered-by-missions-of-current-shift/OdhNotCoveredByMissionsOfCurrentShift';
import OdhNotCoveredByRoutes from 'components/dashboard/menu/cards/odh-not-covered-by-routes/OdhNotCoveredByRoutes';
import OdhCoveredByRoutes from 'components/dashboard/menu/cards/odh-covered-by-routes/OdhCoveredByRoutes';
import CarInWorkOverall from 'components/dashboard/menu/cards/car-in-work-overall/CarInWorkOverall';
import Faxogramms from 'components/dashboard/menu/cards/faxogramms/Faxogramms';
import CurrentDutyMissions from 'components/dashboard/menu/cards/current-duty-missions/CurrentDutyMissions';
import WaybillDraft from 'components/dashboard/menu/cards/waybill-draft/WaybillDraft';
import WaybillInProgress from 'components/dashboard/menu/cards/waybill-in-progress/WaybillInProgress';
import WaybillCompleted from 'components/dashboard/menu/cards/waybill-completed/WaybillCompleted';
import WaybillClosed from 'components/dashboard/menu/cards/waybill-closed/WaybillClosed';

import {
  DashboardMenuCardsContainer,
} from 'components/dashboard/menu/cards/styled/styled';

class DashboardMenuCards extends React.Component<any, {}> {
  componentWillUnmount() {
    this.props.dashBoardResetData();
  }

  render() {
    return (
      <DashboardMenuCardsContainer>
        <CurrentMissions timeDelay={0} timeInterval={60} />
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
  }
}

export default connect(
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
