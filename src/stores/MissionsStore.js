import { Store } from 'flummox';
import { get } from 'lodash';

class MissionsStore extends Store {
  constructor(flux) {
    super();

    const missionsActons = flux.getActions('missions');
    this.register(
      missionsActons.getMissionTemplatesCars,
      this.handleGetMissionTemplatesCars,
    );

    this.state = {
      govNumberFilter: [],
    };
  }

  handleGetMissionTemplatesCars(govNumbers) {
    this.setState({ govNumberFilter: get(govNumbers, 'result.rows', []) });
  }
}

export default MissionsStore;
