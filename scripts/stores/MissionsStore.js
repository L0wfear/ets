import { Store } from 'flummox';
import _ from 'lodash';
import { getToday9am, getTomorrow9am } from '../utils/dates.js';

class MissionsStore extends Store {

  constructor(flux) {
    super();

    const missionsActons = flux.getActions('missions');
    this.register(missionsActons.getMissions, this.handleGetMissions);
    this.register(missionsActons.createMission, this.handleGetMissions);
    this.register(missionsActons.updateMission, this.handleGetMissions);
    this.register(missionsActons.removeMission, this.handleGetMissions);
    this.register(missionsActons.getMissionSources, this.handleGetMissionSources);
    this.register(missionsActons.getMissionTemplates, this.handleGetMissionTemplates);
    this.register(missionsActons.createMissionTemplate, this.handleGetMissionTemplates);
    this.register(missionsActons.removeMissionTemplate, this.handleGetMissionTemplates);
    this.register(missionsActons.updateMissionTemplate, this.handleGetMissionTemplates);

    this.state = {
      missionsList: [],
      missionSourcesList: [],
      missionTemplatesList: [],
    };

  }

  handleGetMissions(missions) {
    this.setState({missionsList: missions.result});
	}

  handleGetMissionSources(missionSources) {
    this.setState({missionSourcesList: missionSources.result});
  }

  handleGetMissionTemplates(missionTemplate) {
    this.setState({missionTemplatesList: missionTemplate.result});
  }

  getMissionSourceById(id) {
    return _.find(this.state.missionSourcesList, ms => ms.id === id) || {};
  }

}

export default MissionsStore;

export function getDefaultMission() {
  return {
    description: "",
    date_start: getToday9am(),
    date_end: getTomorrow9am(),
    //id: 1
    //mission_source_id: 1
    //name: "test_mission_111"
    //passes_count: 778
    //technical_operation_id: 8
  };
}
