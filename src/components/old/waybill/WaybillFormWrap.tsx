import * as React from 'react';
import { clone, cloneDeep, get, last } from 'lodash';
import { connect } from 'react-redux';
import { isNullOrUndefined } from 'util';

import { getWarningNotification } from 'utils/notifications';
import { saveData, printData } from 'utils/functions';
import { waybillSchema, waybillClosingSchema } from 'models/WaybillModel';
import WaybillForm from 'components/old/waybill/WaybillForm';
import { getDefaultBill } from 'stores/WaybillsStore';
import Taxes from 'components/old/waybill/Taxes';
import EquipmentTaxes from 'components/old/waybill/EquipmentTaxes';
import { makeReactMessage } from 'utils/helpMessangeWarning';
import {
  getAutobaseState,
  getSomeUniqState,
  getSessionState,
  getEmployeeState,
} from 'redux-main/reducers/selectors';
import {
  actionLoadRefillTypeAndSetInStore,
  actionResetRefillTypeAndSetInStore,
} from 'redux-main/reducers/modules/refill_type/actions_refill_type';
import * as fuelCardsActions from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';
import { validateField } from 'utils/validate/validateField';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import ChangeStatusRequesFormLazy from 'components/new/pages/edc_request/form/changeStatusRequesForm';
import { canSaveTest } from 'components/@next/@form/validate/validate';
import {
  actionPrintWaybill,
  actionUpdateWaybill,
  actionCreateWaybill,
} from 'redux-main/reducers/modules/waybill/waybill_actions';
import { ReduxState } from 'redux-main/@types/state';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { RefillType } from 'redux-main/reducers/modules/refill_type/@types/refillType';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

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

const checkDataForDepartureAndArrivalValues = new Set([
  'fact_departure_date',
  'fact_arrival_date',
  'odometr_end',
  'motohours_end',
  'motohours_equip_end',
]);

const checkDataForRefill = new Set(['car_refill', 'equipment_refill']);

const filterFormErrorByPerission = (isPermittedByKey, formErrors) => {
  return Object.fromEntries(
    Object.entries(formErrors).filter(([key]) => {
      const triggerOnSaveError
        = isPermittedByKey.update
        || (isPermittedByKey.departure_and_arrival_values
          && checkDataForDepartureAndArrivalValues.has(key))
        || (isPermittedByKey.refill && checkDataForRefill.has(key));

      return triggerOnSaveError;
    }),
  );
};

// избавиться
// добавил из-за перерендера
let timeIdGlobal: any = null;

type StateProps = {
  currentUser: InitialStateSession['userData'];
  userCompanyId: InitialStateSession['userData']['company_id'];
  userStructureId: InitialStateSession['userData']['structure_id'];
  fuelCardsList: Array<FuelCard>;
  refillTypeList: Array<RefillType>;
  carList: Array<Car>;
  carIndex: Record<Car['asuods_id'], Car>;
  employeeIndex: Record<Employee['id'], Employee>;
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {
  onCallback: (...arg) => any;
  path?: string;
  page: string;

  onFormHide?: (...arg: Array<any>) => any;

  element: Partial<Waybill>;
};

type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

type State = {
  formState: Partial<Waybill> & {
    motohours_equip_diff: number;
    odometr_diff: number;
    motohours_diff: number;
  };
  timeId: any; // id таймера
  didMountFormState: string; // слепок формы после didMount в waybillForm

  [k: string]: any;
};

class WaybillFormWrap extends React.Component<Props, State> {
  schema: any;

  static defaultProps = {
    onCallback: () => {
      //
    },
    path: 'WabillForm',
    page: 'waybill',
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
        update: props.currentUser.permissionsSet.has(waybillPermissions.update),
        departure_and_arrival_values: props.currentUser.permissionsSet.has(
          waybillPermissions.departure_and_arrival_values,
        ),
        refill: props.currentUser.permissionsSet.has(waybillPermissions.refill),
      },
      // edcRequestIds: [{ request_id: 37, request_number: '202020209', }],
      edcRequestIds: null,
      timeId: null, // id таймера
      didMountFormState: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.handleMultipleChange({});
    }
  }

  componentDidMount() {
    this.props.dispatch(actionLoadRefillTypeAndSetInStore({}, this.props));
    this.props.dispatch(fuelCardsActions.actionLoadOriginFuelCardsGetAndSetInStore(this.props));

    const currentDate = new Date();

    timeIdGlobal = setTimeout(
      () => this.checkError(),
      (60 - currentDate.getSeconds()) * 1000,
    );

    if (this.props.element === null) {
      const defaultBill: any = getDefaultBill({
        company_id: this.props.currentUser.company_id,
      });
      defaultBill.structure_id = this.props.currentUser.structure_id;

      this.schema = waybillSchema;
      this.setState({
        formState: defaultBill,
        canSave: false,
        canClose: false,
        canPrint: false,
        formErrors: this.validate(defaultBill, {}),
      });
    } else {
      const waybill = clone(this.props.element) as State['formState'];
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
        const fuelStart = !isNullOrUndefined(waybill.fuel_start)
          ? parseFloat(waybill.fuel_start.toString())
          : 0;
        const fuelGiven = !isNullOrUndefined(waybill.fuel_given)
          ? parseFloat(waybill.fuel_given.toString())
          : 0;
        const fuelTaxes = Taxes.calculateFinalResult(waybill.tax_data);
        const equipmentFuelStart = !isNullOrUndefined(waybill.equipment_fuel_start)
          ? parseFloat(waybill.equipment_fuel_start.toString())
          : 0;
        const equipmentFuelGiven = !isNullOrUndefined(waybill.equipment_fuel_given)
          ? parseFloat(waybill.equipment_fuel_given.toString())
          : 0;
        const equipmentFuelTaxes = EquipmentTaxes.calculateFinalResult(
          waybill.equipment_tax_data,
        );

        if (waybill.equipment_fuel && !waybill.is_one_fuel_tank) {
          waybill.fuel_end = +(fuelStart + fuelGiven - fuelTaxes);
          waybill.equipment_fuel_end = +(
            equipmentFuelStart
            + equipmentFuelGiven
            - equipmentFuelTaxes
          );
        } else {
          waybill.fuel_end = +(
            fuelStart
            + fuelGiven
            - fuelTaxes
            - equipmentFuelTaxes
          );
          waybill.equipment_fuel_end = null;
        }

        // Расчет пробегов
        waybill.odometr_diff = waybill.odometr_end
          ? waybill.odometr_end || 0 - waybill.odometr_start || 0
          : null;
        waybill.motohours_diff = waybill.motohours_end
          ? waybill.motohours_end - waybill.motohours_start || 0
          : null;
        waybill.motohours_equip_diff = waybill.motohours_equip_end
          ? waybill.motohours_equip_end || 0
            - waybill.motohours_equip_start || 0
          : null;

        if (this.props.element.status === 'active') {
          this.schema = waybillClosingSchema;
          const formErrors: any = filterFormErrorByPerission(
            this.state.isPermittedByKey,
            this.validate(waybill, {}),
          );

          this.setState({
            formState: waybill,
            formErrors,
            canPrint: false,
            canSave:
              (this.state.isPermittedByKey.update
                || this.state.isPermittedByKey.departure_and_arrival_values
                || this.state.isPermittedByKey.refill)
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
              || this.state.isPermittedByKey.departure_and_arrival_values
              || this.state.isPermittedByKey.refill)
            && canSaveTestWrap(this.state.formErrors),
          canClose: this.state.isPermittedByKey.update && Object.values(formErrors).filter((d) => !!d).length,
          formErrors,
        });
      }
    }

    this.checkErrorsWithTime();
    const timeId = this.setTimer(async () => {
      this.checkErrorsWithTime();
    });
    this.setState({timeId});

  }

  componentWillUnmount() {
    clearTimeout(timeIdGlobal);
    this.props.dispatch(actionResetRefillTypeAndSetInStore());
    this.props.dispatch(fuelCardsActions.resetSetFuelCards());

    if(this.state.timeId) {
      this.clearTimer(this.state.timeId);
    }
  }

  async checkErrorsWithTime() {
    await this.props.dispatch(someUniqActions.actionGetAndSetInStoreMoscowTimeServer(
      {},
      {
        page: this.props.page,
        path: this.props.path,
      },
    ));
    this.checkError();
  }

  setTimer(callBackFunc) {
    // const currentDate = new Date();
    const timeId = setInterval(
      callBackFunc,
      30000,
    );
    return timeId;
  }

  clearTimer(timeId) {
    clearInterval(timeId);
  }

  createWaybill = async (waybill) => {
    try {
      const result = await this.props.dispatch(
        actionCreateWaybill(waybill, this.props),
      );
      global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
      return result;
    } catch (e) {
      throw new Error(e);
    }
  };
  updateWaybill = async (waybill) => {
    try {
      const result = await this.props.dispatch(
        actionUpdateWaybill(waybill, this.props),
      );
      global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
      return result;
    } catch (e) {
      throw new Error(e);
    }
  };

  validate = (state, errors) => {
    if (typeof this.schema === 'undefined') {
      return errors;
    }

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
    const newState: Partial<State>  = {};

    formState.fuel_start = formState.fuel_start
      ? parseFloat(formState.fuel_start)
      : formState.fuel_start;
    formState.fuel_given = formState.fuel_given
      ? parseFloat(formState.fuel_given)
      : formState.fuel_given;
    formState.equipment_fuel_start = formState.equipment_fuel_start
      ? parseFloat(formState.equipment_fuel_start)
      : formState.equipment_fuel_start;
    formState.equipment_fuel_given = formState.equipment_fuel_given
      ? parseFloat(formState.equipment_fuel_given)
      : formState.equipment_fuel_given;

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
    const equipmentFuelTaxes = EquipmentTaxes.calculateFinalResult(
      formState.equipment_tax_data,
    );

    if (formState.equipment_fuel && !formState.is_one_fuel_tank) {
      formState.fuel_end = (fuelStart + fuelGiven - fuelTaxes);
      formState.equipment_fuel_end = ( // Возврат по таксировке, л
        equipmentFuelStart
        + equipmentFuelGiven
        - equipmentFuelTaxes
      );
    } else {
      formState.fuel_end = (
        fuelStart
        + fuelGiven
        - fuelTaxes
        - equipmentFuelTaxes
      );
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
    const newState: Partial<State> = {};

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
    timeIdGlobal = setTimeout(() => this.checkError(), 60 * 1000);

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
    console.info(field, value); // eslint-disable-line

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
          lastEquipmentTax.RESULT = EquipmentTaxes.getResult(lastEquipmentTax);
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
    console.info( // eslint-disable-line
      'delete',
      '----->',
      'equipment_fuel_start',
      'fuel_start',
      'motohours_equip_start',
    );

    this.handleMultipleChange(formState);
  };

  handleMultipleChange = (fields) => {
    let formState = cloneDeep(this.state.formState);

    Object.entries(fields).forEach(([field, value]) => {
      console.info(field, value); // eslint-disable-line

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
  handlePrint = async (printonly, type) => {
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
    const callback = (waybill_id = currentWaybillId) => {
      return this.props
        .dispatch(
          actionPrintWaybill(
            {
              type,
              waybill_id,
            },
            this.props,
          ),
        )
        .then((respoce) => saveData(respoce.blob, respoce.fileName))
        .catch((error) => {
          console.warn('waybillFormWrap saveData', error); // eslint-disable-line
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
  };

  /**
   * Отправка формы активного ПЛ
   * @param {boolean} closeForm - закрывать форму после обновления, false - если есть ошибка
   * @param {object} state - содержимое формы
   * @return {undefined}
   */
  submitActiveWaybill = async (closeForm = false, state = this.state.formState) => {
    const formState = { ...state };

    if (closeForm) {
      // если нет ошибки при отправке запросов, то сохраняем ПЛ и закрываем форму ПЛ
      try {
        await this.updateWaybill(formState);
      } catch ({ error_text }) {
        console.error(error_text); // eslint-disable-line
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

    if (!waybillStatus) {
      // если создаем ПЛ
      if (typeof callback === 'function') {
        formState.status = 'draft';
        const r = await this.createWaybill(formState);

        // TODO сейчас возвращается один ПЛ
        const [{ id }] = get(r, 'result', [{ id: null }]) || [{ id: null }];

        try {
          formState.status = 'active';
          formState.id = id;

          await this.updateWaybill(formState);
          callback(id);
        } catch (error) {
          if (!error.errorIsShow) {
            global.NOTIFICATION_SYSTEM.removeNotification(
              'waybilPrintCurrForm',
            );
          }

          this.setState({
            formState: {
              ...formState,
              status: 'draft',
              id,
            },
          });
          throw new Error(error);
        }
      } else {
        formState.status = 'draft';
        try {
          await this.createWaybill(formState);
        } catch ({ error_text }) {
          console.info(error_text); // eslint-disable-line
          return;
        }
      }
      this.props.onCallback();
    } else if (waybillStatus === 'draft') {
      // если ПЛ обновляем
      if (typeof callback === 'function') {
        formState.status = 'active';

        try {
          await this.updateWaybill(formState);
        } catch (e) {
          return;
        }
        callback();
        if (this.props.onCallback) {
          await this.props.onCallback();
        }
      } else {
        try {
          await this.updateWaybill(formState);
        } catch (e) {
          return;
        }
        this.props.onCallback();
      }
    } else if (waybillStatus === 'active') {
      this.submitActiveWaybill();
    } else if (waybillStatus === 'closed') {
      try {
        await this.updateWaybill(formState);
      } catch ({ error_text }) {
        console.info(error_text); // eslint-disable-line
        return;
      }
      this.props.onCallback();
    }
  };

  setDidMountFormState = (didMountFormState) => {
    this.setState({
      didMountFormState,
    });
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

    global.confirmDialog({
      title:
        'Внимание! После закрытия путевого листа редактирование полей будет запрещено.',
      body: 'Вы уверены, что хотите закрыть окно?',
    })
      .then(async () => {
        formState.status = 'closed';
        await this.updateWaybill(formState)
          .then(() => {
            this.props.onCallback();
          })
          .catch((err) => {
            console.error(err);  // eslint-disable-line
            return;
          });
      })
      .catch(() => {
        //
      });
  };

  handlePrintFromMiniButton = async (type: 'plate_special' = 'plate_special') => {
    const { formState } = this.state;

    try {
      const { blob } = await this.props.dispatch(
        actionPrintWaybill(
          {
            type,
            waybill_id: formState.id,
          },
          this.props,
        ),
      );
      printData(blob);
    } catch (e) {
      throw new Error(e);
    }
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
  onFormHide = () => {
    const {
      is_bnso_broken, // долго подгружается
      ...modFormState
    } = this.state.formState;

    JSON.stringify(modFormState) !== this.state.didMountFormState
      ? global.confirmDialog({
        title:
          'Внимание!',
        body: 'Вы уверены, что хотите закрыть карточку ПЛ? Все не сохраненные последние действия будут потеряны.',
        okName: 'Да',
        cancelName: 'Нет',
      })
        .then(() => {
          this.props.onFormHide();
        })
        .catch(() => {
          //
        })
      : this.props.onFormHide();
  };

  render() {
    return (
      <React.Fragment>
        {this.state.formState && (
          <WaybillForm
            formState={this.state.formState}
            handleFormChange={this.handleFormStateChange}
            handleMultipleChange={this.handleMultipleChange}
            onSubmitActiveWaybill={this.submitActiveWaybill}
            onSubmit={this.handleFormSubmit}
            clearSomeData={this.clearSomeData}
            handleClose={this.handleClose}
            handlePrint={this.handlePrint}
            handlePrintFromMiniButton={this.handlePrintFromMiniButton}
            setEdcRequestIds={this.setEdcRequestIds}
            formErrors={this.state.formErrors}
            entity={'waybill'}
            isPermittedByKey={this.state.isPermittedByKey}
            canClose={this.state.canClose}
            canSave={this.state.canSave}
            setDidMountFormState={this.setDidMountFormState}

            show
            onHide={this.onFormHide}
            page={this.props.page}
            path={this.props.path}
          />
        )}
        {this.state.edcRequestIds
          && (Boolean(this.state.edcRequestIds) && (
            <ChangeStatusRequesFormLazy
              onHide={this.requestFormHide}
              array={this.state.edcRequestIds}
            />
          ))}
      </React.Fragment>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    currentUser: state.session.userData,
    userCompanyId: getSessionState(state).userData.company_id,
    userStructureId: getSessionState(state).userData.structure_id,
    fuelCardsList: getAutobaseState(state).fuelCardsList,
    refillTypeList: getSomeUniqState(state).refillTypeList,
    carList: getAutobaseState(state).carList,
    carIndex: getAutobaseState(state).carIndex,
    employeeIndex: getEmployeeState(state).employeeIndex,
    equipmentFuelCardsList: getAutobaseState(state).equipmentFuelCardsList,
    notFiltredFuelCardsIndex: getAutobaseState(state).notFiltredFuelCardsIndex,
  }),
)(WaybillFormWrap);
