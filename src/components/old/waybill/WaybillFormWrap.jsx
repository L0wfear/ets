import React from 'react';
import { clone, cloneDeep, get, last } from 'lodash';
import { getWarningNotification } from 'utils/notifications';
import { saveData, printData } from 'utils/functions';
import { waybillSchema, waybillClosingSchema } from 'models/WaybillModel';
import { FluxContext } from 'utils/decorators';
import WaybillForm from 'components/old/waybill/WaybillForm';
import { getDefaultBill } from 'stores/WaybillsStore';
import Taxes from 'components/old/waybill/Taxes';
import { makeReactMessage } from 'utils/helpMessangeWarning';
import { isNullOrUndefined, isObject, isArray } from 'util';
import { connect } from 'react-redux';
import {
  getAutobaseState,
  getSomeUniqState,
  getSessionState,
} from 'redux-main/reducers/selectors';
import connectToStores from 'flummox/connect';
import {
  actionLoadRefillTypeAndSetInStore,
  actionResetRefillTypeAndSetInStore,
} from 'redux-main/reducers/modules/refill_type/actions_refill_type';
import * as fuelCardsActions from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';
import { validateField } from 'utils/validate/validateField';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import ChangeStatusRequesFormLazy from 'components/new/pages/edc_request/form/changeStatusRequesForm';

const canSaveNotCheckField = [
  'fact_arrival_date',
  'fact_departure_date',
  'fuel_end',
  'distance',
  'motohours_equip_end',
  'equipment_tax_data',
  'tax_data',
  'motohours_end',
  'odometr_end',
  'equipment_fact_fuel_end',
  'fact_fuel_end',
];

const canCloseNotCheckField = ['distance'];

const canSaveTest = (errorsData) => {
  if (isObject(errorsData)) {
    return Object.values(errorsData).every((error) => canSaveTest(error));
  }
  if (isArray(errorsData)) {
    return errorsData.every((error) => canSaveTest(error));
  }

  return !errorsData;
};

const canSaveTestWrap = (formError) => {
  const filredFormErrors = Object.entries(formError).reduce(
    (newObj, [key, value]) => {
      if (!canSaveNotCheckField.includes(key)) {
        newObj[key] = value;
      }

      return newObj;
    },
    {},
  );

  return canSaveTest(filredFormErrors);
};

const canCloseWrap = (formError) => {
  const filredFormErrors = Object.entries(formError).reduce(
    (newObj, [key, value]) => {
      if (!canCloseNotCheckField.includes(key)) {
        newObj[key] = value;
      }

      return newObj;
    },
    {},
  );

  return canSaveTest(filredFormErrors);
};

function calculateWaybillMetersDiff(waybill, field, value) {
  // Для уже созданных ПЛ
  if (waybill.status) {
    // Если изменилось поле "Одометр.Возврат" то считаем "Одометр.Пробег"
    if (field === 'odometr_end') {
      waybill.odometr_diff = value
        ? waybill.odometr_end - waybill.odometr_start
        : null;
    }
    // Если изменилось поле "Моточасы.Возврат" то считаем "Моточасы.Пробег"
    if (field === 'motohours_end') {
      waybill.motohours_diff = value
        ? waybill.motohours_end - waybill.motohours_start
        : null;
    }
    // Если изменилось поле "Моточасы.Оборудование.Возврат" то считаем "Моточасы.Оборудование.пробег"
    if (field === 'motohours_equip_end') {
      waybill.motohours_equip_diff = value
        ? waybill.motohours_equip_end - waybill.motohours_equip_start
        : null;
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

const filterFormErrorByPerission = (isPermittedByKey, formErrors) =>
  Object.entries(formErrors).reduce((newFormError, [key, value]) => {
    if (isPermittedByKey.update) {
      newFormError[key] = value;
    } else if (
      isPermittedByKey.departure_and_arrival_values
      && checkDataForDepartureAndArrivalValues.includes(key)
    ) {
      newFormError[key] = value;
    }

    return newFormError;
  }, {});

// избавиться
// добавил из-за перерендера
let timeId = 0;

@FluxContext
class WaybillFormWrap extends React.Component {
  static defaultProps = {
    onCallback: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      formState: null,
      formErrors: {},
      canSave: false,
      canClose: false,
      canPrint: false,
      name: 'waybillFormWrap',
      isPermittedByKey: {
        update: false,
        departure_and_arrival_values: false,
      },
      // edcRequestIds: [{ request_id: 37, request_number: '202020209', }],
      edcRequestIds: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.handleMultipleChange({});
    }
  }

  componentDidMount() {
    this.props.actionLoadRefillTypeAndSetInStore(
      {},
      {
        page: this.props.page,
        path: this.props.path,
      },
    );
    this.props.fuelCardsGetAndSetInStore(
      {},
      {
        page: this.props.page,
        path: this.props.path,
      },
    );

    const currentDate = new Date();

    timeId = setTimeout(
      () => this.checkError(),
      (60 - currentDate.getSeconds()) * 1000,
    );

    this.setState({
      isPermittedByKey: {
        update: this.props.currentUser.permissions.includes(
          waybillPermissions.update,
        ),
        departure_and_arrival_values: this.props.currentUser.permissions.includes(
          waybillPermissions.departure_and_arrival_values,
        ),
      },
    });

    if (this.props.element === null) {
      const defaultBill = getDefaultBill({
        company_id: this.props.currentUser.company_id,
      });
      if (typeof defaultBill.structure_id === 'undefined') {
        const currentStructureId = this.props.currentUser.structure_id;
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
      const waybill = clone(this.props.element);
      if (!waybill.tax_data) {
        waybill.tax_data = [];
      }
      if (!waybill.equipment_tax_data) {
        waybill.equipment_tax_data = [];
      }
      if (waybill.mission_id_list.filter((v) => v).length === 0) {
        waybill.mission_id_list = [];
      }

      if (
        this.props.element.status === 'active'
        || this.props.element.status === 'closed'
      ) {
        const fuelStart = waybill.fuel_start
          ? parseFloat(waybill.fuel_start)
          : 0;
        const fuelGiven = waybill.fuel_given
          ? parseFloat(waybill.fuel_given)
          : 0;
        const fuelTaxes = Taxes.calculateFinalResult(waybill.tax_data);
        const equipmentFuelStart = waybill.equipment_fuel_start
          ? parseFloat(waybill.equipment_fuel_start)
          : 0;
        const equipmentFuelGiven = waybill.equipment_fuel_given
          ? parseFloat(waybill.equipment_fuel_given)
          : 0;
        const equipmentFuelTaxes = Taxes.calculateFinalResult(
          waybill.equipment_tax_data,
        );

        if (waybill.equipment_fuel && !waybill.is_one_fuel_tank) {
          waybill.fuel_end = (fuelStart + fuelGiven - fuelTaxes).toFixed(3);
          waybill.equipment_fuel_end = (
            equipmentFuelStart
            + equipmentFuelGiven
            - equipmentFuelTaxes
          ).toFixed(3);
        } else {
          waybill.fuel_end = (
            fuelStart
            + fuelGiven
            - fuelTaxes
            - equipmentFuelTaxes
          ).toFixed(3);
          waybill.equipment_fuel_end = null;
        }

        // Расчет пробегов
        waybill.odometr_diff = waybill.odometr_end
          ? (waybill.odometr_end || 0) - (waybill.odometr_start || 0)
          : null;
        waybill.motohours_diff = waybill.motohours_end
          ? waybill.motohours_end - (waybill.motohours_start || 0)
          : null;
        waybill.motohours_equip_diff = waybill.motohours_equip_end
          ? (waybill.motohours_equip_end || 0)
            - (waybill.motohours_equip_start || 0)
          : null;

        if (this.props.element.status === 'active') {
          this.schema = waybillClosingSchema;
          const formErrors = filterFormErrorByPerission(
            this.state.isPermittedByKey,
            this.validate(waybill, {}),
          );

          this.setState({
            formState: waybill,
            formErrors,
            canPrint: false,
            canSave:
              (this.state.isPermittedByKey.update
                || this.state.isPermittedByKey.departure_and_arrival_values)
              && canSaveTestWrap(formErrors)
              && !(
                (formErrors.fact_arrival_date
                  && !formErrors.fact_departure_date)
                || (!formErrors.fact_arrival_date
                  && formErrors.fact_departure_date)
              ),
            canClose:
              this.state.isPermittedByKey.update && canCloseWrap(formErrors),
          });
        } else {
          this.setState({
            formState: waybill,
            formErrors: {},
          });
        }
      } else if (this.props.element.status === 'draft') {
        this.schema = waybillSchema;
        const formErrors = filterFormErrorByPerission(
          this.state.isPermittedByKey,
          this.validate(waybill, {}),
        );

        this.setState({
          formState: waybill,
          canPrint: true,
          canSave:
            (this.state.isPermittedByKey.update
              || this.state.isPermittedByKey.departure_and_arrival_values)
            && canSaveTestWrap(this.state.formErrors),
          canClose: this.state.isPermittedByKey.update && formErrors.length,
          formErrors,
        });
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(timeId);
    this.props.actionResetRefillTypeAndSetInStore();
    this.props.resetSetFuelCards();
  }

  validate = (state, errors) => {
    if (typeof this.schema === 'undefined') return errors;

    const schema = this.schema;
    const formState = { ...state };

    return schema.properties.reduce(
      (formErrors, prop) => {
        const { key } = prop;
        formErrors[key] = validateField(
          prop,
          formState[key],
          formState,
          this.schema,
          this.props,
        );
        return formErrors;
      },
      { ...errors },
    );
  };

  handleFieldsChange = (formState) => {
    let { formErrors } = this.state;
    const newState = {};

    const fuelStart = formState.fuel_start
      ? parseFloat(formState.fuel_start)
      : 0;
    const fuelGiven = formState.fuel_given
      ? parseFloat(formState.fuel_given)
      : 0;
    const fuelTaxes = Taxes.calculateFinalResult(formState.tax_data);
    const equipmentFuelStart = formState.equipment_fuel_start
      ? parseFloat(formState.equipment_fuel_start)
      : 0;
    const equipmentFuelGiven = formState.equipment_fuel_given
      ? parseFloat(formState.equipment_fuel_given)
      : 0;
    const equipmentFuelTaxes = Taxes.calculateFinalResult(
      formState.equipment_tax_data,
    );

    if (formState.equipment_fuel && !formState.is_one_fuel_tank) {
      formState.fuel_end = (fuelStart + fuelGiven - fuelTaxes).toFixed(3);
      formState.equipment_fuel_end = (
        equipmentFuelStart
        + equipmentFuelGiven
        - equipmentFuelTaxes
      ).toFixed(3);
    } else {
      formState.fuel_end = (
        fuelStart
        + fuelGiven
        - fuelTaxes
        - equipmentFuelTaxes
      ).toFixed(3);
    }

    if (
      formState.fuel_end !== this.state.formState.fuel_end
      || isNullOrUndefined(formState.fact_fuel_end)
    ) {
      formState.fact_fuel_end = formState.fuel_end;
    }

    if (
      formState.equipment_fuel_end
        !== this.state.formState.equipment_fuel_end
      || isNullOrUndefined(formState.equipment_fact_fuel_end)
    ) {
      formState.equipment_fact_fuel_end = formState.equipment_fuel_end;
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

    newState.canSave
      = canSaveTestWrap(formErrors)
      && !(
        (formErrors.fact_arrival_date && !formErrors.fact_departure_date)
        || (!formErrors.fact_arrival_date && formErrors.fact_departure_date)
      );

    newState.canClose = canCloseWrap(formErrors);

    newState.formState = formState;
    newState.formErrors = formErrors;
    this.setState(newState);
  };

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

    newState.canSave
      = canSaveTestWrap(formErrors)
      && !(
        (formErrors.fact_arrival_date && !formErrors.fact_departure_date)
        || (!formErrors.fact_arrival_date && formErrors.fact_departure_date)
      );

    newState.canClose = canCloseWrap(formErrors);

    newState.formErrors = formErrors;
    timeId = setTimeout(() => this.checkError(), 60 * 1000);

    if (
      Object.entries(formErrors).some(
        ([key, value]) => value !== this.state.formErrors[key],
      )
    ) {
      this.setState(newState);
    }
  };

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
        if (
          field === 'motohours_equip_end'
          && formState.equipment_tax_data
          && formState.equipment_tax_data.length
          && formState.motohours_equip_diff > 0
        ) {
          const lastEquipmentTax = last(formState.equipment_tax_data);
          lastEquipmentTax.FACT_VALUE = formState.motohours_equip_diff;
          lastEquipmentTax.RESULT = Taxes.getResult(lastEquipmentTax);
        }
      }
    }
    this.handleFieldsChange(formState);
  };

  clearSomeData = () => {
    const formState = cloneDeep(this.state.formState);

    delete formState.equipment_fuel_start;
    delete formState.fuel_start;
    delete formState.motohours_equip_start;

    // prettier-ignore
    console.log( // eslint-disable-line
      'delete',
      '----->',
      'equipment_fuel_start',
      'fuel_start',
      'motohours_equip_start',
    ); // eslint-disable-line

    this.handleMultipleChange(formState);
  };

  handleMultipleChange = (fields) => {
    let formState = cloneDeep(this.state.formState);

    Object.entries(fields).forEach(([field, value]) => {
      console.log(field, value); // eslint-disable-line

      formState[field] = value;
      formState = calculateWaybillMetersDiff(formState, field, value);
    });

    this.handleFieldsChange(formState);
  };

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
      children: makeReactMessage('Формирование печатной формы'),
    });
    const callback = (waybill_id = currentWaybillId) =>
      flux
        .getActions('waybills')
        .printWaybill(print_form_type, waybill_id)
        .then((respoce) => saveData(respoce.blob, respoce.fileName))
        .catch((error) => {
          console.warn('waybillFormWrap saveData', error); // eslint-disable-line
        });

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
  };

  /**
   * Отправка формы активного ПЛ
   * @param {boolean} closeForm - закрывать форму после обновления, false - если есть ошибка
   * @param {object} state - содержимое формы
   * @return {undefined}
   */
  submitActiveWaybill = async (closeForm, state = this.state.formState) => {
    const formState = { ...state };
    const { flux } = this.context;

    if (closeForm) {
      // если нет ошибки при отправке запросов, то сохраняем ПЛ и закрываем форму ПЛ
      try {
        await flux.getActions('waybills').updateWaybill(formState);
      } catch ({ error_text }) {
        console.log(error_text); // eslint-disable-line
        return;
      }

      if (this.state.edcRequestIds) {
        // висит окно с заявкой ЕДЦ
        return;
      }
      this.props.onCallback({
        showWaybillFormWrap: false,
      });
    } else {
      this.props.onCallback({
        showWaybillFormWrap: true,
      });
    }
  };

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

    if (!waybillStatus) {
      // если создаем ПЛ
      if (typeof callback === 'function') {
        formState.status = 'draft';
        const r = await flux.getActions('waybills').createWaybill(formState);

        // TODO сейчас возвращается один ПЛ
        const [{ id }] = get(r, 'result', [{ id: null }]) || [{ id: null }];

        try {
          formState.status = 'active';
          formState.id = id;

          await flux.getActions('waybills').updateWaybill(formState);
          callback(id);
        } catch ({ errorIsShow }) {
          !errorIsShow
            && global.NOTIFICATION_SYSTEM.removeNotification(
              'waybilPrintCurrForm',
            );
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
    } else if (waybillStatus === 'draft') {
      // если ПЛ обновляем
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
      this.submitActiveWaybill();
    } else if (waybillStatus === 'closed') {
      try {
        await flux.getActions('waybills').updateWaybill(formState);
      } catch ({ error_text }) {
        console.log(error_text); // eslint-disable-line
        return;
      }
      this.props.onCallback();
    }
  };

  handleClose = async (taxesControl) => {
    if (!taxesControl) {
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification(
          'Необходимо заполнить нормы для расчета топлива!',
        ),
      );
      return;
    }

    const formState = cloneDeep(this.state.formState);

    confirmDialog({
      title:
        'Внимание! После закрытия путевого листа редактирование полей будет запрещено.',
      body: 'Вы уверены, что хотите закрыть окно?',
    })
      .then(async () => {
        try {
          formState.status = 'closed';
          await this.context.flux
            .getActions('waybills')
            .updateWaybill(formState);
          this.props.onCallback();
        } catch (e) {
          //
        }
      })
      .catch(() => {});
  };

  handlePrintFromMiniButton = (print_form_type = 'plate_special') => {
    const {
      formState: { id: waybill_id },
    } = this.state;

    this.context.flux
      .getActions('waybills')
      .printWaybill(print_form_type, waybill_id)
      .then(({ blob }) => printData(blob))
      .catch(() => {});
  };
  setEdcRequestIds = (edcRequestIds) => {
    if (this.state.edcRequestIds) {
      this.setState({
        edcRequestIds: [...this.state.edcRequestIds, ...edcRequestIds],
      });
    } else {
      this.setState({ edcRequestIds });
    }
  };
  requestFormHide = () => {
    this.setState({ edcRequestIds: null });
    this.props.onCallback({
      showWaybillFormWrap: false,
    });
  };
  render() {
    const { entity } = this.props;
    return (
      <>
        {this.state.formState && (
          <WaybillForm
            formState={this.state.formState}
            onSubmit={this.handleFormSubmit}
            onSubmitActiveWaybill={this.submitActiveWaybill}
            handlePrint={this.handlePrint}
            handleClose={this.handleClose}
            handleFormChange={this.handleFormStateChange}
            handleMultipleChange={this.handleMultipleChange}
            show
            onHide={this.props.onFormHide}
            entity={entity || 'waybill'}
            handlePrintFromMiniButton={this.handlePrintFromMiniButton}
            clearSomeData={this.clearSomeData}
            isPermittedByKey={this.state.isPermittedByKey}
            setEdcRequestIds={this.setEdcRequestIds}
            {...this.state}
          />
        )}
        {this.state.edcRequestIds
          && (Boolean(this.state.edcRequestIds) && (
            <ChangeStatusRequesFormLazy
              onHide={this.requestFormHide}
              array={this.state.edcRequestIds}
            />
          ))}
      </>
    );
  }
}

export default connect(
  (state) => ({
    currentUser: state.session.userData,
    userCompanyId: getSessionState(state).userData.company_id,
    userStructureId: getSessionState(state).userData.structure_id,
    fuelCardsList: getAutobaseState(state).fuelCardsList,
    refillTypeList: getSomeUniqState(state).refillTypeList,
  }),
  (dispatch) => ({
    actionLoadRefillTypeAndSetInStore: (...arg) =>
      dispatch(actionLoadRefillTypeAndSetInStore(...arg)),
    actionResetRefillTypeAndSetInStore: (...arg) =>
      dispatch(actionResetRefillTypeAndSetInStore(...arg)),
    fuelCardsGetAndSetInStore: (...arg) =>
      dispatch(fuelCardsActions.fuelCardsGetAndSetInStore(...arg)),
    resetSetFuelCards: () => dispatch(fuelCardsActions.resetSetFuelCards()),
  }),
)(connectToStores(WaybillFormWrap, ['objects']));
