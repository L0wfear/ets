import { Store } from 'flummox';
import { get } from 'lodash';
import { getToday9am, getTomorrow9am, getDateWithMoscowTz } from 'utils/dates';

class MissionsStore extends Store {
  constructor(flux) {
    super();

    const missionsActons = flux.getActions('missions');
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
      carDutyMissionList: [],
      municipalFacilityList: [],
      govNumberFilter: [],
    };
  }

  handleGetCleaningMunicipalFacilityAllList({
    result: { rows: municipalFacilityList = [] },
  }) {
    this.setState({ municipalFacilityList });
  }

  handleGetMissionTemplatesCars(govNumbers) {
    this.setState({ govNumberFilter: get(govNumbers, 'result.rows', []) });
  }

  handleGetCarDutyMissions(carDutyMissions) {
    this.setState({ carDutyMissionList: carDutyMissions.result });
  }
}

export default MissionsStore;

export function getDefaultDutyMissionsCreationTemplate() {
  return {
    date_start: getToday9am(),
    date_end: getTomorrow9am(),
    mission_source_id: 3,
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
