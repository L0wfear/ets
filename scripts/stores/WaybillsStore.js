import { Store } from 'flummox';
import _ from 'lodash';

class WaybillsStore extends Store {

  constructor(flux) {
    super();

    const waybillsActions = flux.getActions('waybills');
    this.register(waybillsActions.getWaybills, this.handleGetWaybills);
    this.register(waybillsActions.removeWaybill, this.handleRemoveWaybill);
    this.register(waybillsActions.updateWaybill, this.handleUpdateWaybill);
    this.register(waybillsActions.createWaybill, this.handleCreateWaybill);

    this.state = {
      waybillsList: [],
    };

  }

  handleGetWaybills(waybillsList) {
    waybillsList = _.clone(waybillsList);
    this.setState({waybillsList});
  }

  //todo: определить объединять или нет
  handleRemoveWaybill(waybillsList) {
    console.info('REMOVED WAYBILL');
    this.setState({waybillsList});
  }

  handleUpdateWaybill(waybillsList) {
    console.info('UPDATED WAYBILL');
    this.setState({waybillsList});
  }

  handleCreateWaybill(waybillsList) {
    console.info('CREATED WAYBILL');
    this.setState({waybillsList});
  }

}

export default WaybillsStore;
