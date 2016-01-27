import { Actions } from 'flummox';
import { getMissions, getMissionSources, createMission, removeMission, updateMission, getMissionTemplates, createMissionTemplate, removeMissionTemplate } from '../adapter.js';
import _ from 'lodash';
import { createValidDateTime } from '../utils/dates.js';

export default class MissionsActions extends Actions {

  getMissions() {
    return getMissions();
  }

  getMissionSources() {
    return getMissionSources();
  }

  createMission(mission) {
    const payload = _.clone(mission);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return createMission(payload);
  }

  removeMission(id) {
    const payload = { id };
    return removeMission(payload);
  }

  updateMission() {
    return updateMission();
  }

  getMissionTemplates() {
    return getMissionTemplates();
  }

  createMissionTemplate(missionTemplate) {
    const payload = _.clone(missionTemplate);
    return createMissionTemplate(payload);
  }

  removeMissionTemplate(id) {
    const payload = { id };
    return removeMissionTemplate(payload);
  }

}
