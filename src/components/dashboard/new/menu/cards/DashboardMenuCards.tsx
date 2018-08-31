import * as React from 'react';

import CurrentMissions from 'components/dashboard/new/menu/cards/current-missions/CurrentMissions';
import FutureMissions from 'components/dashboard/new/menu/cards/future-missions/FutureMissions';
import OdhNotCoveredByMissionsOfCurrentShift from 'components/dashboard/new/menu/cards/odh-not-covered-by-missions-of-current-shift/OdhNotCoveredByMissionsOfCurrentShift';
import OdhNotCoveredByRoutes from '/Users/vladimirleshchev/Desktop/gost/ets-frontend/src/components/dashboard/new/menu/cards/odh-not-covered-by-routes/OdhNotCoveredByRoutes';
import OdhCoveredByRoutes from 'components/dashboard/new/menu/cards/odh-covered-by-routes/OdhCoveredByRoutes';
import CarInWorkOverall from 'components/dashboard/new/menu/cards/car-in-work-overall/CarInWorkOverall';
import Faxogramms from 'components/dashboard/new/menu/cards/faxogramms/Faxogramms';
import CurrentDutyMissions from 'components/dashboard/new/menu/cards/current-duty-missions/CurrentDutyMissions';
import WaybillDraft from 'components/dashboard/new/menu/cards/waybill-draft/WaybillDraft';
import WaybillInProgress from 'components/dashboard/new/menu/cards/waybill-in-progress/WaybillInProgress';
import WaybillCompleted from 'components/dashboard/new/menu/cards/waybill-completed/WaybillCompleted';
import WaybillClosed from 'components/dashboard/new/menu/cards/waybill-closed/WaybillClosed';

require('components/dashboard/new/menu/cards/DashboardMenuCards.scss');

const DashboardMenuCards: React.SFC<any> = ({ history }) => (
  <div className="dashboard_menu_cards">
    <CurrentMissions timeDelay={0} />
    <FutureMissions timeDelay={1} />
    <OdhNotCoveredByMissionsOfCurrentShift timeDelay={2} />
    <OdhNotCoveredByRoutes timeDelay={3} history={history} />
    <OdhCoveredByRoutes timeDelay={4}/>
    <CarInWorkOverall timeDelay={5}/>
    <Faxogramms timeDelay={6} />
    <CurrentDutyMissions timeDelay={7} />
    <WaybillDraft timeDelay={8} />
    <WaybillInProgress timeDelay={9} />
    <WaybillCompleted timeDelay={10} />
    <WaybillClosed timeDelay={11} />
  </div>
);

export default DashboardMenuCards;
