import {
  CurrentMissionsAnsType,
  CurrentMissionsInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

import {
  FutureMissionsAnsType,
  FutureMissionsInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/future-mission.h';

import {
  OdhNotCoveredByMissionsOfCurrentShiftAnsType,
  OdhNotCoveredByMissionsOfCurrentShiftInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-not-covered-by-missions-of-current-shift.h';

import {
  OdhNotCoveredByRoutesAnsType,
  OdhNotCoveredByRoutesInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-not-covered-by-routes.h';

import {
  OdhCoveredByRoutesAnsType,
  OdhCoveredByRoutesInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-covered-by-routes.h';

import {
  CarInWorkOverallAnsType,
  CarInWorkOverallInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';

import {
  FaxogrammsAnsType,
  FaxogrammsInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/faxogramms.h';

import {
  CurrentDutyMissionsAnsType,
  CurrentDutyMissionsInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

import {
  WaybillDraftAnsType,
  WaybillDraftInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-draft.h';

import {
  WaybillInProgressAnsType,
  WaybillInProgressInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-in-progress.h';

import {
  WaybillCompletedAnsType,
  WaybillCompletedInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-completed.h';

import {
  WaybillClosedAnsType,
  WaybillClosedInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-closed.h';

export type DefaultCardType<T, I> = {
  data: T,
  isLoading: boolean;
  dateLoad: Date;
  infoData: I | null;
};

export type InitialStateDashboard = {
  current_missions: DefaultCardType<CurrentMissionsAnsType, CurrentMissionsInfoDataType>;
  future_missions: DefaultCardType<FutureMissionsAnsType, FutureMissionsInfoDataType>;
  odh_not_covered_by_missions_of_current_shift: DefaultCardType<OdhNotCoveredByMissionsOfCurrentShiftAnsType, OdhNotCoveredByMissionsOfCurrentShiftInfoDataType>;
  odh_not_covered_by_routes: DefaultCardType<OdhNotCoveredByRoutesAnsType, OdhNotCoveredByRoutesInfoDataType>;
  odh_covered_by_routes: DefaultCardType<OdhCoveredByRoutesAnsType, OdhCoveredByRoutesInfoDataType>;
  car_in_work_overall: DefaultCardType<CarInWorkOverallAnsType, CarInWorkOverallInfoDataType>;
  faxogramms: DefaultCardType<FaxogrammsAnsType, FaxogrammsInfoDataType>;
  current_duty_missions: DefaultCardType<CurrentDutyMissionsAnsType, CurrentDutyMissionsInfoDataType>;
  waybill_draft: DefaultCardType<WaybillDraftAnsType, WaybillDraftInfoDataType>;
  waybill_in_progress: DefaultCardType<WaybillInProgressAnsType, WaybillInProgressInfoDataType>;
  waybill_completed: DefaultCardType<WaybillCompletedAnsType, WaybillCompletedInfoDataType>;
  waybill_closed: DefaultCardType<WaybillClosedAnsType, WaybillClosedInfoDataType>;
};
