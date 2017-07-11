import { Actions } from 'flummox';
import { cloneDeep } from 'lodash';
import { AutoBase } from 'api/Services';
import AUTOBASE from '../constants/autobase.js';
import { createValidDate, createValidDateTime } from 'utils/dates';

export default class EmployeesActions extends Actions {

  async getAutobaseListByType(type) {
    const trueType = AUTOBASE[type];
    const payload = {};

    const response = await AutoBase.path(trueType).get(payload);

    return {
      type,
      data: response,
    };
  }

  /*
  POST /autobase/battery_registry/
{
    'battery__brand_id': {'type': int, 'required': True},
    'battery__serial_number': {'type': str, 'required': True},
    'battery__lifetime_months': {'type': int, 'required': True},
    'battery__released_at': {'type': 'date', 'required': True},
    'battery_on_car__car_id': {'type': int, 'required': False},
    'battery_on_car__installed_at': {'type': 'date', 'required': False},
    'battery_on_car__uninstalled_at': {'type': 'date', 'required': False},
        }
*/
  async createBatteryReg(formState) {
    const payload = _.cloneDeep(formState);

    payload.battery__released_at = createValidDate(payload.battery__released_at);

    console.log(payload);
    /*
    const response = await AutoBase.path(AUTOBASE.btr).post(payload);
      return {
        type,
        data: response,
      };
      */
  }

/*
// ID батареи
   'battery__id': {'type': int, 'required': True},
   'battery__brand_id': {'type': int, 'required': True},
    'battery__serial_number': {'type': str, 'required': True},
    'battery__lifetime_months': {'type': int, 'required': True},
    'battery__released_at': {'type': 'date', 'required': True},

    // ID в таблице-связке (батерея на машине). 
    // По сути это и есть ID записи реестра.
    'battery_on_car__id': {'type': int, 'required': True},

    'battery_on_car__car_id': {'type': int, 'required': False},
    'battery_on_car__installed_at': {'type': 'date', 'required': False},
    'battery_on_car__uninstalled_at': {'type': 'date', 'required': False},
        }
*/
  async updateBattareReg(formState) {
    console.log(formState);
    const payload = {};
    const keysForm = Object.keys(formState);

    payload.battery__id = formState.battery__id;
    payload.battery__brand_id = formState.battery__brand_id;
    payload.battery__serial_number = formState.battery__serial_number;
    payload.battery__lifetime_months = formState.battery__lifetime_months;
    payload.battery__released_at = createValidDate(formState.battery__released_at);
    payload.battery_on_car__id = formState.battery_on_car__id;

    ['battery_on_car__car_id', 'battery_on_car__installed_at', 'battery_on_car__uninstalled_at'].filter(d => keysForm.includes(d) && !!formState[d]).forEach((d) => {
      if (['battery_on_car__installed_at', 'battery_on_car__uninstalled_at'].includes(d)) {
        payload[d] = createValidDate(formState[d]);
      } else {
        payload[d] = formState[d];
      }
    });

    const response = await AutoBase.path(AUTOBASE_CONSTANT.btr).put(payload, false, 'json');
    console.log(response);
    return {
      type,
      data: response,
    };
  }

  async getSparePartGroup() {
    const payload = {};

    const response = await AutoBase.path('spare_part_group').get(payload);

    return response.result.rows || [];
  }

  async getSparePartMeasureUnit() {
    const payload = {};

    const response = await AutoBase.path('measure_unit').get(payload);

    return response.result.rows || [];
  }

  sparePart(method, formState) {
    const payload = cloneDeep(formState);
    const { sparePart } = AUTOBASE;

    return AutoBase.path(sparePart)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'sparePart'),
      'json',
    );
  }

  batteryBrand(method, formState) {
    const payload = cloneDeep(formState);
    const { batteryBrand } = AUTOBASE;

    return AutoBase.path(batteryBrand)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'batteryBrand'),
      'json',
    );
  }

  batteryManufacturer(method, formState) {
    const payload = cloneDeep(formState);
    const { batteryManufacturer } = AUTOBASE;

    return AutoBase.path(batteryManufacturer)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'batteryManufacturer'),
      'json',
    );
  }

  deleteLineFromSarePart(formState) {
    const payload = { id: formState };
    const type = 'sparePart';

    const trueType = AUTOBASE[type];

    return AutoBase.path(trueType).delete(
      payload,
      this.getAutobaseListByType.bind(null, type),
      'json',
    );
  }
}
