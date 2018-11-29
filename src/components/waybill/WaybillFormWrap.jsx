import React from 'react';
import {
  clone,
  cloneDeep,
  filter,
  get,
  last,
  max,
} from 'lodash';
import FormWrap from 'components/compositions/FormWrap';
import { getWarningNotification } from 'utils/notifications';
import {
  saveData,
  printData,
} from 'utils/functions';
import { waybillSchema, waybillClosingSchema } from 'models/WaybillModel';
import { FluxContext } from 'utils/decorators';
import permissions from 'components/waybill/config-data/permissions';
import WaybillForm from 'components/waybill/WaybillForm';
import { getDefaultBill } from 'stores/WaybillsStore';
import Taxes from './Taxes';
import { makeReactMessange } from 'utils/helpMessangeWarning';
import { DivNone } from 'global-styled/global-styled';
import { isNullOrUndefined } from 'util';

function calculateWaybillMetersDiff(waybill, field, value) {
  // Для уже созданных ПЛ
  if (waybill.status) {
    // Если изменилось поле "Одометр.Возврат" то считаем "Одометр.Пробег"
    if (field === 'odometr_end') {
      waybill.odometr_diff = value ? waybill.odometr_end - waybill.odometr_start : null;
    }
    // Если изменилось поле "Моточасы.Возврат" то считаем "Моточасы.Пробег"
    if (field === 'motohours_end') {
      waybill.motohours_diff = value ? waybill.motohours_end - waybill.motohours_start : null;
    }
    // Если изменилось поле "Моточасы.Оборудование.Возврат" то считаем "Моточасы.Оборудование.пробег"
    if (field === 'motohours_equip_end') {
      waybill.motohours_equip_diff = value ? waybill.motohours_equip_end - waybill.motohours_equip_start : null;
    }
  }
  return waybill;
}

const checkDataForDepartureAndArrivalValues = [
  'fact_departure_date',
  'fact_arrival_date',
  'odometr_end',
  'motohours_end',
  'motohours_equip_end',
];

const filterFormErrorByPerission = (isPermittedByKey, formErrors) => (
  Object.entries(formErrors).reduce((newFormError, [key, value]) => {
    if (isPermittedByKey.update) {
      newFormError[key] = value;
    } else if (isPermittedByKey.departure_and_arrival_values && checkDataForDepartureAndArrivalValues.includes(key)) {
      newFormError[key] = value;
    }

    return newFormError;
  }, {})
);

// избавиться
// добавил из-за перерендера
let timeId = 0;

@FluxContext
export default class WaybillFormWrap extends FormWrap {
  static defaultProps = {
    onCallback: () => {},
  }

  constructor(props, context) {
    super(props);
    this.state = {
      formState: null,
      formErrors: {},
      canSave: false,
      canClose: false,
      canPrint: false,
      name: 'waybillFormWrap',
      isPermittedByKey: {
        update: context.flux.getStore('session').state.userPermissions.includes(permissions.update),
        departure_and_arrival_values: context.flux.getStore('session').state.userPermissions.includes(permissions.departure_and_arrival_values),
      },
    };
  }

  componentWillReceiveProps(props) {
    if (props.showForm && props.showForm !== this.props.showForm) {
      const currentDate = new Date();

      timeId = setTimeout(() => this.checkError(), (60 - currentDate.getSeconds()) * 1000);

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
        const waybill = clone(props.element);
        if (!waybill.tax_data) {
          waybill.tax_data = [];
        }
        if (!waybill.equipment_tax_data) {
          waybill.equipment_tax_data = [];
        }
        if (waybill.mission_id_list.filter((v) => v).length === 0) {
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
          waybill.odometr_diff = waybill.odometr_end ? (waybill.odometr_end || 0) - (waybill.odometr_start || 0) : null;
          waybill.motohours_diff = waybill.motohours_end ? (waybill.motohours_end) - (waybill.motohours_start || 0) : null;
          waybill.motohours_equip_diff = waybill.motohours_equip_end ? (waybill.motohours_equip_end || 0) - (waybill.motohours_equip_start || 0) : null;

          if (props.element.status === 'active') {
            this.schema = waybillClosingSchema;
            const formErrors = filterFormErrorByPerission(
              this.state.isPermittedByKey,
              this.validate(waybill, {}),
            );

            this.setState({
              formState: waybill,
              formErrors,
              canPrint: false,
              canSave: (this.state.isPermittedByKey.update || this.state.isPermittedByKey.departure_and_arrival_values) && !clone(formErrors, (v, k) => ['fact_arrival_date', 'fact_departure_date', 'fuel_end', 'distance', 'motohours_equip_end', 'motohours_end', 'odometr_end'].includes(k) ? false : v).length,
              canClose: this.state.isPermittedByKey.update && !filter(formErrors, (v, k) => ['distance'].includes(k) ? false : v).length,
            });
          } else {
            this.setState({
              formState: waybill,
              formErrors: {},
            });
          }
        } else if (props.element.status === 'draft') {
          this.schema = waybillSchema;
          const formErrors = filterFormErrorByPerission(
            this.state.isPermittedByKey,
            this.validate(waybill, {}),
          );

          this.setState({
            formState: waybill,
            canPrint: true,
            canSave: (this.state.isPermittedByKey.update || this.state.isPermittedByKey.departure_and_arrival_values) && !formErrors.length,
            canClose: this.state.isPermittedByKey.update && formErrors.length,
            formErrors,
          });
        }
      }
    }
  }
  componentWillUnmount() {
    clearTimeout(timeId);
  }

  handleFieldsChange = (formState) => {
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

    if (formState.fuel_end !== this.state.formState.fuel_end || isNullOrUndefined(formState.fact_fuel_end)) {
      formState.fact_fuel_end = formState.fuel_end;
    }

    if (!formState.status || formState.status === 'draft') {
      this.schema = waybillSchema;
    } else if (formState.status && formState.status !== 'draft') {
      this.schema = waybillClosingSchema;
    }
    formErrors = filterFormErrorByPerission(
      this.state.isPermittedByKey,
      this.validate(formState, formErrors),
    );

    newState.canSave = !filter(formErrors, (v, k) => ['fact_arrival_date', 'fact_departure_date', 'fuel_end', 'fact_fuel_end', 'distance', 'motohours_equip_end', 'motohours_end', 'odometr_end'].includes(k) ? false : v).length;
    newState.canClose = !filter(formErrors, (v, k) => ['distance'].includes(k) ? false : v).length;

    newState.formState = formState;
    newState.formErrors = formErrors;
    this.setState(newState);
  }

  checkError = (formState = this.state.formState) => {
    let { formErrors } = this.state;
    const newState = {};

    if (!formState.status || formState.status === 'draft') {
      this.schema = waybillSchema;
    } else if (formState.status && formState.status !== 'draft') {
      this.schema = waybillClosingSchema;
    }

    formErrors = filterFormErrorByPerission(
      this.state.isPermittedByKey,
      this.validate(formState, formErrors),
    );

    newState.canSave = !filter(formErrors, (v, k) => ['fact_arrival_date', 'fact_departure_date', 'fuel_end', 'fact_fuel_end', 'distance', 'motohours_equip_end', 'motohours_end', 'odometr_end'].includes(k) ? false : v).length;
    newState.canClose = !filter(formErrors, (v, k) => ['distance'].includes(k) ? false : v).length;

    newState.formErrors = formErrors;
    timeId = setTimeout(() => this.checkError(), 60 * 1000);

    if (Object.entries(formErrors).some(([key, value]) => value !== this.state.formErrors[key])) {
      this.setState(newState);
    }
  }


  handleFormStateChange = (field, e) => {
    const value = get(e, ['target', 'value'], e);
    let formState = cloneDeep(this.state.formState);
    formState[field] = value;
    console.log(field, value); // eslint-disable-line

    formState = calculateWaybillMetersDiff(formState, field, value);

    // TODO при формировании FACT_VALUE считать diff - finalFactValue
    if (formState.tax_data && formState.tax_data.length) {
      const lastTax = last(formState.tax_data);

      if (lastTax) {
        if (field === 'odometr_end' && formState.odometr_diff >= 0) {
          if (lastTax.is_excluding_mileage) {
            lastTax.iem_FACT_VALUE = formState.odometr_diff;
          } else {
            lastTax.FACT_VALUE = formState.odometr_diff;
            lastTax.RESULT = Taxes.getResult(lastTax);
          }
        }
        if (field === 'motohours_end' && formState.motohours_diff >= 0) {
          if (lastTax.is_excluding_mileage) {
            lastTax.iem_FACT_VALUE = formState.odometr_diff;
          } else {
            lastTax.FACT_VALUE = formState.motohours_diff;
            lastTax.RESULT = Taxes.getResult(lastTax);
          }
        }
        if (formState.odometr_diff < 0 || formState.motohours_diff < 0) {
          if (lastTax.is_excluding_mileage) {
            lastTax.iem_FACT_VALUE = formState.odometr_diff;
          } else {
            lastTax.FACT_VALUE = null;
            lastTax.RESULT = Taxes.getResult(lastTax);
          }
        }
        if (field === 'motohours_equip_end' && formState.equipment_tax_data
          && formState.equipment_tax_data.length && formState.motohours_equip_diff > 0) {
          const lastEquipmentTax = last(formState.equipment_tax_data);
          lastEquipmentTax.FACT_VALUE = formState.motohours_equip_diff;
          lastEquipmentTax.RESULT = Taxes.getResult(lastEquipmentTax);
        }
      }
    }
    this.handleFieldsChange(formState);
  }

  clearSomeData = () => {
    const formState = cloneDeep(this.state.formState);

    delete formState.equipment_fuel_start;
    delete formState.fuel_start;
    delete formState.motohours_equip_start;
    console.log('delete', '----->', 'equipment_fuel_start', 'fuel_start', 'motohours_equip_start'); // eslint-disable-line

    this.handleMultipleChange(formState);
  }

  handleMultipleChange = (fields) => {
    let formState = cloneDeep(this.state.formState);

    Object.entries(fields).forEach(([field, value]) => {
      console.log(field, value); // eslint-disable-line

      formState[field] = value;
      formState = calculateWaybillMetersDiff(formState, field, value);
    });

    this.handleFieldsChange(formState);
  }

  /**
   * Выдача (печать) Путевого листа
   * @param {boolean} printonly - Только скачивание или скачивание+сохранение
   * @param {object} event
   * @param {number 1|2} print_form_type - Идентификатор печатной формы
   * @return {undefined}
   */
  handlePrint = async (printonly, print_form_type) => {
    const { flux } = this.context;
    const { formState } = this.state;

    const currentWaybillId = formState.id;

    this.setState({ canSave: false });
    global.NOTIFICATION_SYSTEM.notifyWithObject({
      title: 'Загрузка печатной формы',
      level: 'info',
      position: 'tc',
      dismissible: false,
      autoDismiss: 0,
      uid: 'waybilPrintCurrForm',
      children: makeReactMessange('Формирование печатной формы'),
    });
    const callback = (waybill_id = currentWaybillId) => {
      return flux.getActions('waybills').printWaybill(print_form_type, waybill_id)
        .then((respoce) => (
          saveData(respoce.blob, respoce.fileName)
        ))
        .catch((error) => {
          console.warn('waybillFormWrap saveData', error);
        });
    };

    try {
      if (printonly) {
        await callback();
      } else {
        await this.handleFormSubmit(formState, callback);
      }
    } catch (e) {
      //
    }

    global.NOTIFICATION_SYSTEM.removeNotification('waybilPrintCurrForm');
    this.setState({ canSave: true });
  }

  /**
   * Отправка формы ПЛ
   * @param {object} state - содержимое формы
   * @param {function} callback - функция, вызываемая после отправки
   * @return {undefined}
   */
  handleFormSubmit = async (state = this.state.formState, callback) => {
    const formState = cloneDeep(state);
    const waybillStatus = formState.status;
    const { flux } = this.context;

    if (!waybillStatus) { // если создаем ПЛ
      if (typeof callback === 'function') {
        formState.status = 'draft';
        const r = await flux.getActions('waybills').createWaybill(formState);

        // TODO сейчас возвращается один ПЛ
        const id = max(r.result, res => res.id).id;
        try {
          formState.status = 'active';
          formState.id = id;

          await flux.getActions('waybills').updateWaybill(formState);
          callback(id);
        } catch ({ errorIsShow }) {
          !errorIsShow && global.NOTIFICATION_SYSTEM.removeNotification('waybilPrintCurrForm');
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
        } catch ({ error_text }) {
          console.log(error_text); // eslint-disable-line
          return;
        }
      }
      this.props.onCallback();
    } else if (waybillStatus === 'draft') { // если ПЛ обновляем
      if (typeof callback === 'function') {
        formState.status = 'active';

        try {
          await flux.getActions('waybills').updateWaybill(formState);
        } catch (e) {
          return;
        }
        callback();
        if (this.props.onCallback) {
          await this.props.onCallback();
        }
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
      } catch ({ error_text }) {
        console.log(error_text); // eslint-disable-line
        return;
      }
      this.props.onCallback();
    } else if (waybillStatus === 'closed') {
      try {
        await flux.getActions('waybills').updateWaybill(formState);
      } catch ({ error_text }) {
        console.log(error_text); // eslint-disable-line
        return;
      }
      this.props.onCallback();
    }

    return;
  }

  handleClose = async (taxesControl) => {
    const { formState } = this.state;
    const prevStatus = formState.status;
    if (!taxesControl) {
      global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Необходимо заполнить нормы для расчета топлива!'));
      return;
    }

    confirmDialog({
      title: 'Внимание! После закрытия путевого листа редактирование полей будет запрещено.',
      body: 'Вы уверены, что хотите закрыть окно?',
    })
    .then(async () => {
      try {
        formState.status = 'closed';
        await this.context.flux.getActions('waybills').updateWaybill(formState);
        this.props.onCallback();
      } catch (e) {
        formState.status = prevStatus;
        // await this.context.flux.getActions('waybills').updateWaybill(formState);
        return;
      }
    })
    .catch(() => {});
  }

  handlePrintFromMiniButton = (print_form_type = 'plate_special') => {
    const { formState: { id: waybill_id } } = this.state;

    this.context.flux.getActions('waybills').printWaybill(print_form_type, waybill_id)
      .then(({ blob }) => printData(blob))
      .catch(() => {});
  }

  render() {
    const { entity } = this.props;

    return this.props.showForm
      ? (
        <WaybillForm
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit}
          handlePrint={this.handlePrint}
          handleClose={this.handleClose}
          handleFormChange={this.handleFormStateChange}
          handleMultipleChange={this.handleMultipleChange}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          entity={entity || 'waybill'}
          handlePrintFromMiniButton={this.handlePrintFromMiniButton}
          clearSomeData={this.clearSomeData}
          isPermittedByKey={this.state.isPermittedByKey}
          {...this.state}
        />
      )
      : (
        <DivNone />
      )
  }

}
