import { Actions } from 'flummox';
import { getWaybills, removeWaybill, updateWaybill, createWaybill } from '../adapter.js';

export default class WaybillsActions extends Actions {

  constructor(props) {
    super();
  }

  getWaybills() {
    return getWaybills();
  }

  removeWaybill(id) {
    return removeWaybill(id);
  }

  saveWaybill(waybill) {
    return;
  }

  updateWaybill(waybill, correctionFlag) {
    return updateWaybill(waybill, correctionFlag);
  }

  createWaybill(waybill) {
    return createWaybill(waybill);
  }

}
