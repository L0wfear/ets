import current_missions from './CurrentMission.jsx';
import faxogramms from './Faxogramms.jsx';
import current_duty_missions from './CurrentDutyMission.jsx';
import waybill_active from './WaybillActive.jsx';
import waybill_closed from './WaybillClosed.jsx';
import waybill_draft from './WaybillDraft.jsx';
import future_missions from './FutureMissions.jsx';
import odh_not_covered_by_routes from './OdhNotCoveredByRoutes.jsx';
import odh_not_covered_by_missions_of_current_shift from './OdhNotCoveredByMissions.jsx';

const customCards = {
  current_missions,
  future_missions,
  faxogramms,
  current_duty_missions,
  waybill_draft,
  waybill_active,
  waybill_closed,
  odh_not_covered_by_routes,
  odh_not_covered_by_missions_of_current_shift
};

export default customCards;
