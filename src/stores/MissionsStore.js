import { Store } from 'flummox';
import { get, find } from 'lodash';
import { getToday9am, getTomorrow9am, getDateWithMoscowTz } from 'utils/dates';

class MissionsStore extends Store {
  constructor(flux) {
    super();

    const missionsActons = flux.getActions('missions');
    this.register(missionsActons.getMissions, this.handleGetMissions);
    this.register(
      missionsActons.getMissionSources,
      this.handleGetMissionSources,
    );
    this.register(
      missionsActons.getMissionTemplatesCars,
      this.handleGetMissionTemplatesCars,
    );
    this.register(
      missionsActons.getCarDutyMissions,
      this.handleGetCarDutyMissions,
    );
    this.register(
      missionsActons.getCleaningMunicipalFacilityAllList,
      this.handleGetCleaningMunicipalFacilityAllList,
    );

    this.state = {
      missionsList: [],
      missionSourcesList: [],
      carDutyMissionList: [],
      municipalFacilityList: [],
      missionsTotalCount: 0,
      govNumberFilter: [],
    };
  }

  handleGetCleaningMunicipalFacilityAllList({
    result: { rows: municipalFacilityList = [] },
  }) {
    this.setState({ municipalFacilityList });
  }

  handleGetMissions(missions) {
    this.setState({
      missionsList: get(missions, 'result.rows', []),
      missionsTotalCount: get(missions, 'result.meta.total_count', 0),
    });
  }

  handleGetMissionSources({ result: { rows: missionSourcesList } }) {
    this.setState({ missionSourcesList });
  }

  handleGetMissionTemplatesCars(govNumbers) {
    this.setState({ govNumberFilter: get(govNumbers, 'result.rows', []) });
  }

  handleGetCarDutyMissions(carDutyMissions) {
    this.setState({ carDutyMissionList: carDutyMissions.result });
  }

  getMissionSourceById(id) {
    return find(this.state.missionSourcesList, (ms) => ms.id === id) || {};
  }
}

export default MissionsStore;

export function getDefaultMission(
  date_start = getDateWithMoscowTz(),
  date_end = getTomorrow9am(),
) {
  return {
    // Если будете исправлять, проверте типизацию
    description: '',
    date_start,
    date_end,
    assign_to_waybill: 'assign_to_new_draft',
    mission_source_id: 3,
    passes_count: 1,
    is_new: true,
  };
}

export function getDefaultDutyMission() {
  return {
    status: 'not_assigned',
    plan_date_start: getToday9am(),
    plan_date_end: getTomorrow9am(),
    fact_date_start: null,
    fact_date_end: null,
    brigade_employee_id_list: [],
    comment: '',
    car_mission_id: 0,
    is_new: true,
  };
}

export function getDefaultDutyMissionsCreationTemplate() {
  return {
    date_start: getToday9am(),
    date_end: getTomorrow9am(),
    mission_source_id: 3,
  };
}

export function getDefaultMissionTemplate() {
  return {
    description: '',
    passes_count: 1,
    car_ids: [],
    car_type_id: [],
    norm_id: [],
    is_cleaning_norm: [],
    assign_to_waybill: [],
    date_create: getDateWithMoscowTz(),
    is_new: true,
  };
}

export function getDefaultMissionsCreationTemplate(missionsObj, for_column) {
  if (for_column) {
    return {
      date_start: getDateWithMoscowTz(),
      date_end: getTomorrow9am(),
      assign_to_waybill: Object.entries(missionsObj).reduce(
        (newObj, [id, { car_ids }]) => {
          newObj[id] = car_ids.reduce((newObjCarId, car_id) => {
            newObjCarId[car_id] = 'assign_to_new_draft';

            return newObjCarId;
          }, {});

          return newObj;
        },
        {},
      ),
      norm_id: Object.entries(missionsObj).reduce(
        (newObj, [id, { car_ids }]) => {
          newObj[id] = car_ids.reduce((newObjCarId, car_id) => {
            newObjCarId[car_id] = null;

            return newObjCarId;
          }, {});

          return newObj;
        },
        {},
      ),
      mission_source_id: 3,
      passes_count: 1,
      is_new: true,
    };
  }

  return {
    date_start: getDateWithMoscowTz(),
    date_end: getTomorrow9am(),
    assign_to_waybill: 'assign_to_new_draft',
    norm_id: Object.entries(missionsObj).reduce((newObj, [id, { car_ids }]) => {
      newObj[id] = car_ids.reduce((newObjCarId, car_id) => {
        newObjCarId[car_id] = null;

        return newObjCarId;
      }, {});

      return newObj;
    }, {}),
    mission_source_id: 3,
    passes_count: 1,
    is_new: true,
  };
}
