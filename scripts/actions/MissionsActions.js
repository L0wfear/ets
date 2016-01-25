import { Actions } from 'flummox';
import { getMissions, getMissionSources, createMission, removeMission, updateMission } from '../adapter.js';
import _ from 'lodash';
import moment from 'moment';

export default class MissionsActions extends Actions {

  getMissions() {
    return getMissions();
  }

  getMissionSources() {
    return getMissionSources();
  }

  createMission(mission) {
    const payload = _.clone(mission);
    return createMission(payload);
  }

  removeMission(id) {
    const payload = {
      id,
    };

    return removeMission(payload);
  }

  updateMission() {
    return updateMission();
  }

}
