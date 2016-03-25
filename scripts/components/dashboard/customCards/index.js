import current_missions from './CurrentMission.jsx';
import faxogramms from './Faxogramms.jsx';
import waybill_active from './WaybillActive.jsx';
import waybill_closed from './WaybillClosed.jsx';
import waybill_draft from './WaybillDraft.jsx';
import future_missions from './FutureMissions.jsx';
import odh_not_covered_by_routes from './OdhNotCoveredByRoutes.jsx';

const customCards = {
  current_missions,
  future_missions,
  faxogramms,
  waybill_draft,
  waybill_active,
  waybill_closed,
  odh_not_covered_by_routes
};

export default customCards;
