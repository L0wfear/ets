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

  handleGetWaybills(waybills) {
    this.setState({waybillsList: waybills.result});
  }

  //todo: определить объединять или нет
  handleRemoveWaybill(waybills) {
    this.setState({waybillsList: waybills.result});
  }

  handleUpdateWaybill(waybillsList) {
    console.info('UPDATED WAYBILL');
    this.setState({waybillsList});
  }

  handleCreateWaybill(waybills) {
    console.info('CREATED WAYBILL');
    this.setState({waybillsList: waybills.result});
  }

}

export default WaybillsStore;
