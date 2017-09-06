import React from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Div from 'components/ui/Div.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { getWarningNotification } from 'utils/notifications';
import {
  hasOdometer,
  saveData,
} from 'utils/functions';
import { waybillSchema, waybillClosingSchema } from 'models/WaybillModel.js';
import { FluxContext } from 'utils/decorators';
import WaybillForm from './WaybillForm.jsx';
import { getDefaultBill } from '../../stores/WaybillsStore.js';
import Taxes from './Taxes.jsx';

function calculateWaybillMetersDiff(waybill, field, value) {
  // Для уже созданных ПЛ
  if (waybill.status) {
    // Если изменилось поле "Одометр.Возврат" то считаем "Одометр.Пробег"
    if (field === 'odometr_end') {
      waybill.odometr_diff = value ? parseFloat(waybill.odometr_end - waybill.odometr_start).toFixed(3) : null;
    }
    // Если изменилось поле "Моточасы.Возврат" то считаем "Моточасы.Пробег"
    if (field === 'motohours_end') {
      waybill.motohours_diff = value ? parseFloat(waybill.motohours_end - waybill.motohours_start).toFixed(3) : null;
    }
    // Если изменилось поле "Моточасы.Оборудование.Возврат" то считаем "Моточасы.Оборудование.пробег"
    if (field === 'motohours_equip_end') {
      waybill.motohours_equip_diff = value ? parseFloat(waybill.motohours_equip_end - waybill.motohours_equip_start).toFixed(3) : null;
    }
  }
  return waybill;
}

@FluxContext
@autobind
export default class WaybillFormWrap extends FormWrap {
  static defaultProps = {
    onCallback: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      formState: null,
      formErrors: {},
      canSave: false,
      canClose: false,
      canPrint: false,
    };
  }

  componentWillReceiveProps(props) {
    if (props.showForm && props.showForm !== this.props.showForm) {
      if (props.element === null) {
        const defaultBill = getDefaultBill();
        if (typeof defaultBill.structure_id === 'undefined') {
          const currentStructureId = this.context.flux.getStore('session').getCurrentUser().structure_id;
          defaultBill.structure_id = currentStructureId;
        }
        this.schema = waybillSchema;
        this.setState({
          formState: defaultBill,
          canSave: false,
          canClose: false,
          canPrint: false,
          formErrors: this.validate(defaultBill, {}),
        });
      } else {
        const waybill = _.clone(props.element);
        if (!waybill.tax_data) {
          waybill.tax_data = [];
        }
        if (!waybill.equipment_tax_data) {
          waybill.equipment_tax_data = [];
        }
        if (waybill.mission_id_list.filter(v => v).length === 0) {
          waybill.mission_id_list = [];
        }

        if (props.element.status === 'active' || props.element.status === 'closed') {
          const fuelStart = waybill.fuel_start ? parseFloat(waybill.fuel_start) : 0;
          const fuelGiven = waybill.fuel_given ? parseFloat(waybill.fuel_given) : 0;
          const fuelTaxes = Taxes.calculateFinalResult(waybill.tax_data);
          const equipmentFuelStart = waybill.equipment_fuel_start ? parseFloat(waybill.equipment_fuel_start) : 0;
          const equipmentFuelGiven = waybill.equipment_fuel_given ? parseFloat(waybill.equipment_fuel_given) : 0;
          const equipmentFuelTaxes = Taxes.calculateFinalResult(waybill.equipment_tax_data);

          if (waybill.equipment_fuel) {
            waybill.fuel_end = ((fuelStart + fuelGiven) - fuelTaxes).toFixed(3);
            waybill.equipment_fuel_end = ((equipmentFuelStart + equipmentFuelGiven) - equipmentFuelTaxes).toFixed(3);
          } else {
            waybill.fuel_end = ((fuelStart + fuelGiven) - fuelTaxes - equipmentFuelTaxes).toFixed(3);
          }

          // Расчет пробегов
          waybill.odometr_diff = waybill.odometr_end ? parseFloat((waybill.odometr_end || 0) - (waybill.odometr_start || 0)).toFixed(3) : null;
          waybill.motohours_diff = waybill.motohours_end ? parseFloat((waybill.motohours_end) - (waybill.motohours_start || 0)).toFixed(3) : null;
          waybill.motohours_equip_diff = waybill.motohours_equip_end ? parseFloat((waybill.motohours_equip_end || 0) - (waybill.motohours_equip_start || 0)).toFixed(3) : null;

          if (props.element.status === 'active') {
            this.schema = waybillClosingSchema;
            const formErrors = this.validate(waybill, {});
            this.setState({
              formState: waybill,
              formErrors,
              canPrint: false,
              canSave: !_.filter(formErrors, (v, k) => ['fuel_end', 'distance', 'motohours_equip_end', 'motohours_end', 'odometr_end'].includes(k) ? false : v).length,
              canClose: !_.filter(formErrors, (v, k) => ['distance'].includes(k) ? false : v).length,
            });
          } else {
            this.setState({
              formState: waybill,
              formErrors: {},
            });
          }
        } else if (props.element.status === 'draft') {
          this.schema = waybillSchema;
          this.setState({
            formState: waybill,
            canPrint: true,
            canSave: !_.filter(this.validate(waybill, {})).length,
            canClose: !_.filter(this.validate(waybill, {})).length,
            formErrors: this.validate(waybill, {}),
          });
        }
      }
    }
  }

  handleFieldsChange(formState) {
    let { formErrors } = this.state;
    const newState = {};

    const fuelStart = formState.fuel_start ? parseFloat(formState.fuel_start) : 0;
    const fuelGiven = formState.fuel_given ? parseFloat(formState.fuel_given) : 0;
    const fuelTaxes = Taxes.calculateFinalResult(formState.tax_data);
    const equipmentFuelStart = formState.equipment_fuel_start ? parseFloat(formState.equipment_fuel_start) : 0;
    const equipmentFuelGiven = formState.equipment_fuel_given ? parseFloat(formState.equipment_fuel_given) : 0;
    const equipmentFuelTaxes = Taxes.calculateFinalResult(formState.equipment_tax_data);

    if (formState.equipment_fuel) {
      formState.fuel_end = ((fuelStart + fuelGiven) - fuelTaxes).toFixed(3);
      formState.equipment_fuel_end = ((equipmentFuelStart + equipmentFuelGiven) - equipmentFuelTaxes).toFixed(3);
    } else {
      formState.fuel_end = ((fuelStart + fuelGiven) - fuelTaxes - equipmentFuelTaxes).toFixed(3);
    }

    if (!formState.status || formState.status === 'draft') {
      this.schema = waybillSchema;
      formErrors = this.validate(formState, formErrors);
    } else if (formState.status && formState.status !== 'draft') {
      this.schema = waybillClosingSchema;
      formErrors = this.validate(formState, formErrors);
    }

    newState.canSave = !_.filter(formErrors, (v, k) => ['fuel_end', 'distance', 'motohours_equip_end', 'motohours_end', 'odometr_end'].includes(k) ? false : v).length;
    newState.canClose = !_.filter(formErrors, (v, k) => ['distance'].includes(k) ? false : v).length;

    newState.formState = formState;
    newState.formErrors = formErrors;
    this.setState(newState);
  }


  handleFormStateChange(field, e) {
    const value = _.get(e, ['target', 'value'], e);
    let formState = _.cloneDeep(this.state.formState);
    formState[field] = value;

    formState = calculateWaybillMetersDiff(formState, field, value);

    // TODO при формировании FACT_VALUE считать diff - finalFactValue
    if (formState.tax_data && formState.tax_data.length) {
      const lastTax = _.last(formState.tax_data);
      if (field === 'odometr_end' && formState.odometr_diff > 0) {
        lastTax.FACT_VALUE = formState.odometr_diff;
        lastTax.RESULT = Taxes.getResult(lastTax);
      }
      if (field === 'motohours_end' && formState.motohours_diff > 0) {
        lastTax.FACT_VALUE = formState.motohours_diff;
        lastTax.RESULT = Taxes.getResult(lastTax);
      }
      if (formState.odometr_diff < 0 || formState.motohours_diff < 0) {
        lastTax.FACT_VALUE = null;
        lastTax.RESULT = Taxes.getResult(lastTax);
      }
      if (field === 'motohours_equip_end' && formState.equipment_tax_data
        && formState.equipment_tax_data.length && formState.motohours_equip_diff > 0) {
        const lastEquipmentTax = _.last(formState.equipment_tax_data);
        lastEquipmentTax.FACT_VALUE = formState.motohours_equip_diff;
        lastEquipmentTax.RESULT = Taxes.getResult(lastEquipmentTax);
      }
    }
    this.handleFieldsChange(formState);
  }

  handleMultipleChange(fields) {
    let formState = _.cloneDeep(this.state.formState);
    const { car_id = -1 } = fields;

    if (car_id !== formState.car_id) {
      delete formState.equipment_fuel_start;
      delete formState.fuel_start;
      delete formState.motohours_equip_start;
    }

    Object.entries(fields).forEach(([field, value]) => {
      formState[field] = value;
      formState = calculateWaybillMetersDiff(formState, field, value);
    });

    /*
    if (hasOdometer(fields.gov_number)) {
      delete formState.motohours_start;
    } else {
      delete formState.odometr_start;
    }
    */
    this.handleFieldsChange(formState);
  }

  /**
   * Выдача (печать) Путевого листа
   * @param {boolean} printonly - Только скачивание или скачивание+сохранение
   * @param {object} event
   * @param {number 1|2} print_form_type - Идентификатор печатной формы
   * @return {undefined}
   */
  handlePrint(printonly, event, print_form_type) {
    const { flux } = this.context;
    const { formState } = this.state;

    const currentWaybillId = formState.id;

    const callback = (createdWaybillId) => {
      const waybill_id = createdWaybillId || currentWaybillId;
      flux.getActions('waybills').printWaybill(print_form_type, waybill_id)
        .then(({ blob, fileName }) => {
          saveData(blob, fileName);
        });
    };
    printonly ? callback() : this.handleFormSubmit(formState, callback);
  }

  /**
   * Отправка формы ПЛ
   * @param {object} state - содержимое формы
   * @param {function} callback - функция, вызываемая после отправки
   * @return {undefined}
   */
  async handleFormSubmit(state = this.state.formState, callback) {
    const formState = _.cloneDeep(state);
    const waybillStatus = formState.status;
    const { flux } = this.context;

    if (!waybillStatus) { // если создаем ПЛ
      if (typeof callback === 'function') {
        formState.status = 'draft';
        const r = await flux.getActions('waybills').createWaybill(formState);
        // TODO сейчас возвращается один ПЛ
        const id = _.max(r.result, res => res.id).id;
        try {
          formState.status = 'active';
          formState.id = id;
          formState.fact_departure_date = formState.plan_departure_date;
          formState.fact_arrival_date = formState.plan_arrival_date;
          await flux.getActions('waybills').updateWaybill(formState);
          callback(id);
        } catch (e) {
          this.setState({
            formState: {
              ...formState,
              status: 'draft',
              id,
            },
          });
          return;
        }
      } else {
        formState.status = 'draft';
        try {
          await flux.getActions('waybills').createWaybill(formState);
        } catch (e) {
          console.log(e);
          return;
        }
      }
      this.props.onCallback();
    } else if (waybillStatus === 'draft') { // если ПЛ обновляем
      if (typeof callback === 'function') {
        formState.status = 'active';
        formState.fact_departure_date = formState.plan_departure_date;
        formState.fact_arrival_date = formState.plan_arrival_date;
        try {
          await flux.getActions('waybills').updateWaybill(formState);
        } catch (e) {
          return;
        }
        callback();
        (await this.props.onCallback()) && this.props.onCallback();
      } else {
        try {
          await flux.getActions('waybills').updateWaybill(formState);
        } catch (e) {
          return;
        }
        this.props.onCallback();
      }
    } else if (waybillStatus === 'active') {
      try {
        await flux.getActions('waybills').updateWaybill(formState);
      } catch (e) {
        console.log(e);
        return;
      }
      this.props.onCallback();
    } else if (waybillStatus === 'closed') {
      try {
        await flux.getActions('waybills').updateWaybill(formState);
      } catch (e) {
        console.log(e);
        return;
      }
      this.props.onCallback();
    }

    return;
  }

  async handleClose(taxesControl) {
    const { formState } = this.state;
    const prevStatus = formState.status;
    if (!taxesControl) {
      global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Необходимо заполнить нормы для расчета топлива!'));
      return;
    }
    confirmDialog({
      title: 'Внимание: После закрытия путевого листа редактирование полей будет запрещено.',
      body: 'Вы уверены, что хотите закрыть окно?',
    })
    .then((async) () => {
      try {
        formState.status = 'closed';
        await this.context.flux.getActions('waybills').updateWaybill(formState);
      } catch (e) {
        formState.status = prevStatus;
        await this.context.flux.getActions('waybills').updateWaybill(formState);
        this.props.onCallback();
        return;
      }
      this.props.onCallback();
    })
    .catch(() => {});
  }

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <WaybillForm
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit}
          handlePrint={this.handlePrint}
          handleClose={this.handleClose}
          handleFormChange={this.handleFormStateChange}
          handleMultipleChange={this.handleMultipleChange}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          {...this.state}
        />
      </Div>
    );
  }

}
