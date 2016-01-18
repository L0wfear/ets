import { Actions } from 'flummox';
import { getWaybills, removeWaybill, updateWaybill, createWaybill } from '../adapter.js';
import moment from 'moment';
import _ from 'lodash';

let createValidDate = (date) => moment(date).format('DD.MM.YYYY');

export default class WaybillsActions extends Actions {

  constructor(props) {
    super();
  }

  getWaybills() {
    return getWaybills();
  }

  removeWaybill(id) {
    const payload = {
      id,
    }
    return removeWaybill(payload);
  }

  saveWaybill(waybill) {
    return;
  }

  updateWaybill(waybill, correctionFlag) {
    const payload = _.clone(waybill);
    payload.plan_departure_date = createValidDate(payload.plan_departure_date);
    payload.plan_arrival_date = createValidDate(payload.plan_arrival_date);
    payload.fact_departure_date = createValidDate(payload.fact_departure_date);
    payload.fact_arrival_date = createValidDate(payload.fact_arrival_date);
    //delete payload.motohours_equip_end;
    //delete payload.motohours_equip_start;
    delete payload.odometr_diff;
    delete payload.motohours_diff;
    delete payload.motohours_equip_diff;
    //delete payload.id;
    delete payload.date_create;
    delete payload.isSelected;
    //delete payload.status;
    payload.fuel_end.length === 0 ? payload.fuel_end = 0 : payload.fuel_end = parseInt(payload.fuel_end, 10);
    payload.fuel_given.length === 0 ? payload.fuel_given = 0 : payload.fuel_given = parseInt(payload.fuel_given, 10);
    payload.motohours_end.length === 0 ? payload.motohours_end = 0 : payload.motohours_end = parseInt(payload.motohours_end, 10);
    payload.odometr_end.length === 0 ? payload.odometr_end = 0 : payload.odometr_end = parseInt(payload.odometr_end, 10);
    payload.odometr_end.length === 0 ? payload.odometr_end = 0 : payload.odometr_end = parseInt(payload.odometr_end, 10);
    return updateWaybill(payload, correctionFlag);
  }

  createWaybill(waybill) {
    const payload = _.clone(waybill);
    payload.plan_departure_date = createValidDate(payload.plan_departure_date);
    payload.plan_arrival_date = createValidDate(payload.plan_arrival_date);
    payload.fact_departure_date = createValidDate(payload.fact_departure_date);
    payload.fact_arrival_date = createValidDate(payload.fact_arrival_date);
    //delete payload.motohours_equip_end;
    //delete payload.motohours_equip_start;
    //delete payload.ID;
    //delete payload.date_create;
    delete payload.odometr_diff;
    delete payload.motohours_diff;
    delete payload.motohours_diff;
    //delete payload.status;
    payload.fuel_end.length === 0 ? payload.fuel_end = 0 : payload.fuel_end = parseInt(payload.fuel_end, 10);
    payload.fuel_given.length === 0 ? payload.fuel_given = 0 : payload.fuel_given = parseInt(payload.fuel_given, 10);
    payload.motohours_end.length === 0 ? payload.motohours_end = 0 : payload.motohours_end = parseInt(payload.motohours_end, 10);
    payload.odometr_end.length === 0 ? payload.odometr_end = 0 : payload.odometr_end = parseInt(payload.odometr_end, 10);
    payload.motohours_equip_end.length === 0 ? payload.motohours_equip_end = 0 : payload.motohours_equip_end = parseInt(payload.motohours_equip_end, 10);
    //console.log(payload);
    return createWaybill(payload);
  }

}
