import * as React from 'react';
import { clone, cloneDeep, get, eq } from 'lodash';
import { connect } from 'react-redux';
import { isNullOrUndefined } from 'util';

import { getWarningNotification } from 'utils/notifications';
import { saveData, printData, parseFloatWithFixed } from 'utils/functions';
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
import { waybillSchema, waybillClosingSchema } from 'components/old/waybill/waybillSchema';
import { validate } from 'components/old/ui/form/new/validate';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

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
  'fuel_given',
  'equipment_fuel_given',
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
    if (field === 'odometr_end' || field === 'odometr_start') {
      waybill.odometr_diff = value
        ? waybill.odometr_end - waybill.odometr_start
        : null;
    }
    // Если изменилось поле "Моточасы.Возврат" то считаем "Моточасы.Пробег"
    if (field === 'motohours_end' || field === 'motohours_start') {
      waybill.motohours_diff = value
        ? waybill.motohours_end - waybill.motohours_start
        : null;
    }
    // Если изменилось поле "Моточасы.Оборудование.Возврат" то считаем "Моточасы.Оборудование.пробег"
    if (field === 'motohours_equip_end' || field === 'motohours_equip_start') {
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
  equipmentFuelCardsList: Array<FuelCard>;
  notFiltredFuelCardsIndex: Record<FuelCard['id'], FuelCard>;
  moscowTimeServer: IStateSomeUniq['moscowTimeServer'];
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

export type WaybillFormWrapProps = (
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

  [k: string]: any;
};

class WaybillFormWrap extends React.Component<WaybillFormWrapProps, State> {
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
        update_closed: props.currentUser.permissionsSet.has(waybillPermissions.update_closed),
      },
      // edcRequestIds: [{ request_id: 37, request_number: '202020209', }],
      edcRequestIds: null,
      timeId: null, // id таймера
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
      defaultBill.plan_departure_date = this.props.moscowTimeServer.date;

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
        || this.props.element.status === 'deleted'
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
          waybill.fuel_end = parseFloatWithFixed((fuelStart + fuelGiven - fuelTaxes), 3);
          waybill.equipment_fuel_end = parseFloatWithFixed((
            equipmentFuelStart
            + equipmentFuelGiven
            - equipmentFuelTaxes
          ), 3);
        } else {
          waybill.fuel_end = parseFloatWithFixed((
            fuelStart
            + fuelGiven
            - fuelTaxes
            - equipmentFuelTaxes
          ), 3);
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

        if (this.props.element.status === 'active' || this.props.element.status === 'deleted') {
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

    this.checkErrorsWithTime(true);
    const timeId = this.setTimer(this.checkErrorsWithTime);
    this.setState({ timeId });

  }

  componentWillUnmount() {
    clearTimeout(timeIdGlobal);
    this.props.dispatch(actionResetRefillTypeAndSetInStore());
    this.props.dispatch(fuelCardsActions.resetSetFuelCards());

    if(this.state.timeId) {
      this.clearTimer(this.state.timeId);
    }
  }

  checkErrorsWithTime = async (first?: boolean) => {
    await this.props.dispatch(
      someUniqActions.actionGetAndSetInStoreMoscowTimeServer(
        {},
        first
          ? {
            page: this.props.page,
            path: this.props.path,
          }
          : {
            page: 'none',
          },
      ),
    );
    this.checkError();
  };

  setTimer = (callBackFunc) => {
    // const currentDate = new Date();
    const timeId = setInterval(
      callBackFunc,
      30000,
    );
    return timeId;
  };

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

    const formState = { ...state };

    return validate(
      this.schema,
      formState,
      this.props,
      formState,
    );
  };

  handleFieldsChange = (formState) => {
    let { formErrors } = this.state;
    const newState: Partial<State> = {};

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
    const equipmentFactFuelEnd = formState.equipment_fact_fuel_end
      ? parseFloat(formState.equipment_fact_fuel_end)
      : 0;
    const equipmentFuelTaxes = EquipmentTaxes.calculateFinalResult(
      formState.equipment_tax_data,
    );

    formState.tax_consumption = formState.is_one_fuel_tank && formState.equipment_fuel
      ? parseFloatWithFixed(equipmentFuelTaxes + fuelTaxes, 3)
      : parseFloatWithFixed(fuelTaxes, 3);
    formState.equipment_fact_consuption = parseFloatWithFixed((
      equipmentFuelStart
      + equipmentFuelGiven
      - equipmentFactFuelEnd
    ), 3);
    if (formState.equipment_fuel && !formState.is_one_fuel_tank) {
      formState.fuel_end = parseFloatWithFixed((fuelStart + fuelGiven - fuelTaxes), 3);
      formState.equipment_fuel_end = parseFloatWithFixed(( // Возврат по таксировке, л
        equipmentFuelStart
        + equipmentFuelGiven
        - equipmentFuelTaxes
      ), 3);
      formState.equipment_tax_consumption = parseFloatWithFixed(equipmentFuelTaxes, 3);
      formState.equipment_consuption_diff = Math.abs(
        parseFloatWithFixed((
          formState.equipment_tax_consumption
          - formState.equipment_fact_consuption
        ), 3)
      );
    } else {
      formState.fuel_end = parseFloatWithFixed((
        fuelStart
        + fuelGiven
        - fuelTaxes
        - equipmentFuelTaxes
      ), 3);
    }

    if (
      formState.fuel_end !== this.state.formState.fuel_end
      || isNullOrUndefined(formState.fact_fuel_end)
    ) {
      formState.fact_fuel_end = formState.fuel_end;
    }
    formState.fact_consuption = parseFloatWithFixed((
      fuelStart
      + fuelGiven
      - formState.fact_fuel_end
    ), 3);
    formState.consuption_diff = Math.abs(
      parseFloatWithFixed((
        formState.tax_consumption
        - formState.fact_consuption
      ), 3)
    );

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
        // || formErrors.motohours_equip_end
      );

    newState.canClose = canCloseWrap(formErrors);

    newState.formState = formState;
    newState.formErrors = formErrors;
    this.setState(newState);
  };

  checkError = (formState = this.state.formState) => {
    let { formErrors } = this.state;
    const newState: Partial<State> = {};

    if (!formState?.status || formState?.status === 'draft') {
      this.schema = waybillSchema;
    } else if (formState?.status && formState?.status !== 'draft') {
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
    const govNumberRegExp = /^[\d]{4}/;
    const isWithOdometr = Boolean(govNumberRegExp.exec(formState.gov_number));
    formState = calculateWaybillMetersDiff(formState, field, value);
    // TODO при формировании FACT_VALUE считать diff - finalFactValue
    if (formState.tax_data && formState.tax_data.length) {
      formState.tax_data.forEach((val) => {
        if (val.FACT_VALUE === 0) {
          val.FACT_VALUE = 1;
          val.RESULT = Taxes.getResult(val);
        }
        if (
          (field === 'odometr_end' || field === 'taxes_operation'|| field === 'taxes' || field === 'odometr_start')
          && val.measure_unit_name !== 'л/моточас'
          && formState.odometr_diff > 0
          && (val.measure_unit_name === 'л/км' || !isWithOdometr)
        ) {
          if (val.is_excluding_mileage) {
            val.iem_FACT_VALUE = formState.odometr_diff;
          } else {
            val.FACT_VALUE = formState.odometr_diff;
            val.RESULT = Taxes.getResult(val);
          }
        }
        if (
          (field === 'motohours_end' || field === 'taxes_operation' || field === 'taxes' || field === 'motohours_start')
           && val.measure_unit_name !== 'л/км'
           && formState.motohours_diff > 0
           && (val.measure_unit_name === 'л/моточас' || isWithOdometr)
        ) {
          if (val.is_excluding_mileage) {
            val.iem_FACT_VALUE = formState.motohours_diff;
          } else {
            val.FACT_VALUE = formState.motohours_diff;
            val.RESULT = Taxes.getResult(val);
          }
        }
        if (
          val.measure_unit_name !== 'л/моточас'
          && (val.measure_unit_name === 'л/км' || !isWithOdometr)
          && formState.odometr_diff <= 0
          && (field === 'taxes_operation' || field === 'taxes')
        ) {
          if (val.is_excluding_mileage) {
            val.iem_FACT_VALUE = formState.odometr_diff;
          } else {
            val.FACT_VALUE = null;
            val.RESULT = Taxes.getResult(val);
          }
        }

        if (
          val.measure_unit_name !== 'л/км'
          && (val.measure_unit_name === 'л/моточас' || isWithOdometr)
          && formState.motohours_diff <= 0
          && (field === 'taxes_operation' || field === 'taxes')
        ) {
          if (val.is_excluding_mileage) {
            val.iem_FACT_VALUE = formState.motohours_diff;
          } else {
            val.FACT_VALUE = null;
            val.RESULT = Taxes.getResult(val);
          }
        }
      });
    } 
    
    if (
      formState.equipment_tax_data 
      && formState.equipment_tax_data.length 
      && (field === 'equipment_tax_data' || field === 'motohours_equip_end')
    ) {
      formState.equipment_tax_data.forEach((val) => {
        if (val.FACT_VALUE === 0) {
          val.FACT_VALUE = 1;
          val.RESULT = Taxes.getResult(val);
        }
        if(
          (field === 'equipment_tax_data'
            && !val.OPERATION
            && formState.motohours_equip_diff > 0)
            || (field === 'motohours_equip_end'
            && formState.motohours_equip_diff > 0)
        ) {
          val.FACT_VALUE = formState.motohours_equip_diff;
          val.RESULT = EquipmentTaxes.getResult(val);
        } else if (
          field === 'equipment_tax_data'
            && val.OPERATION
            && val.FACT_VALUE > 0
        ) {
          val.RESULT = EquipmentTaxes.getResult(val);
        } else {
          val.FACT_VALUE = null;
          val.RESULT = EquipmentTaxes.getResult(val);
        }
      });
    }
    this.handleFieldsChange(formState);
  };

    clearSomeData = () => {
      const formState = cloneDeep(this.state.formState);

      delete formState.equipment_fuel_start;
      delete formState.fuel_start;
      delete formState.motohours_equip_start;

      formState.car_has_motohours = null;
      formState.car_has_odometr = null;

      // prettier-ignore
      console.info( // eslint-disable-line
        'delete fields',
        '----->',
        'equipment_fuel_start',
        'fuel_start',
        'motohours_equip_start',
        'clear fields',
        '----->',
        'car_has_motohours',
        'car_has_odometr',
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
            this.props.onCallback();
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
      } else if (waybillStatus === 'draft') {
        // если ПЛ обновляем
        if (typeof callback === 'function') {
          try {
            await this.updateWaybill({...formState, status: 'active'});
            this.props.onCallback();
          } catch (e) {
            try {
              await this.updateWaybill({...formState, status: 'draft'});
            } catch (e) {
              return;
            }
            return;
          }
          callback();
        } else {
          try {
            await this.updateWaybill(formState);
          } catch (e) {
            return;
          }
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
    onFormHide = async () => {
      const { formState } = this.state;

      const showConfirm = (
        !eq(formState.status, 'closed')
      );

      if (showConfirm) {
        try {
          await global.confirmDialog({
            title:
              'Внимание!',
            body: 'Вы уверены, что хотите закрыть карточку ПЛ? Все не сохраненные последние действия будут потеряны.',
            okName: 'Да',
            cancelName: 'Нет',
          });
        } catch (e) {
          return;
        }
      }

      this.props.onCallback();
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
    moscowTimeServer: state.some_uniq.moscowTimeServer,
  }),
)(WaybillFormWrap);
