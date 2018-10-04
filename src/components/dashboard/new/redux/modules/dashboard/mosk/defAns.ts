import { CurrentMissionsAnsType } from 'components/dashboard/new/redux/modules/dashboard/@types/current-mission.h';
import { FutureMissionsAnsType } from 'components/dashboard/new/redux/modules/dashboard/@types/future-mission.h';
import { OdhNotCoveredByMissionsOfCurrentShiftAnsType } from 'components/dashboard/new/redux/modules/dashboard/@types/odh-not-covered-by-missions-of-current-shift.h';
import { OdhNotCoveredByRoutesAnsType } from 'components/dashboard/new/redux/modules/dashboard/@types/odh-not-covered-by-routes.h';
import { OdhCoveredByRoutesAnsType } from 'components/dashboard/new/redux/modules/dashboard/@types/odh-covered-by-routes.h';
import { CarInWorkOverallAnsType } from 'components/dashboard/new/redux/modules/dashboard/@types/car-in-work-overall.h';
import { FaxogrammsAnsType } from 'components/dashboard/new/redux/modules/dashboard/@types/faxogramms.h';
import { CurrentDutyMissionsAnsType } from 'components/dashboard/new/redux/modules/dashboard/@types/current-duty-mission.h';
import { WaybillDraftAnsType } from 'components/dashboard/new/redux/modules/dashboard/@types/waibill-draft.h';
import { WaybillInProgressAnsType}  from 'components/dashboard/new/redux/modules/dashboard/@types/waibill-in-progress.h';
import { WaybillCompletedAnsType } from 'components/dashboard/new/redux/modules/dashboard/@types/waibill-completed.h';
import { WaybillClosedAnsType } from 'components/dashboard/new/redux/modules/dashboard/@types/waibill-closed.h';

export const current_missions: CurrentMissionsAnsType = {
  items: [],
  title: 'Текущие задания (0)',
};

export const future_missions: FutureMissionsAnsType = {
  title: 'Отложенные задания (0)',
  items: [],
};

export const odh_not_covered_by_missions_of_current_shift: OdhNotCoveredByMissionsOfCurrentShiftAnsType = {
  title: 'ОДХ/ДТ не назначенные на текущие задания',
  items: [],
};

export const odh_not_covered_by_routes: OdhNotCoveredByRoutesAnsType = {
  title: 'ОДХ/ДТ не охваченные маршрутами тех.операций',
  items: [],
};

export const odh_covered_by_routes: OdhCoveredByRoutesAnsType = {
  title: 'ОДХ/ДТ охваченные маршрутами тех.операции',
  items: [],
};

export const car_in_work_overall: CarInWorkOverallAnsType = {
  title: 'ТС в работе',
  items: [],
};

export const faxogramms: FaxogrammsAnsType = {
  title: 'Текущие факсограммы (0)',
  items: [],
};

export const current_duty_missions: CurrentDutyMissionsAnsType = {
  title: 'Текущие наряд-задания (0)',
  items: [],
};

export const waybill_draft: WaybillDraftAnsType = {
  title: 'Черновики путевых листов',
  items: [],
};

export const waybill_in_progress: WaybillInProgressAnsType = {
  title: 'Выданные путевые листы (в работе)',
  items: [],
};

export const waybill_completed: WaybillCompletedAnsType = {
  title: 'Выданные путевые листы (выполненные)',
  items: [],
};

export const waybill_closed: WaybillClosedAnsType = {
  title: 'Закрытые путевые листы за сегодня',
  items: [],
};
