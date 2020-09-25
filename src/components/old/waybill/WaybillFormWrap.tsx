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
  getCompanyState,
} from 'redux-main/reducers/selectors';
import {
  actionLoadRefillTypeAndSetInStore,
  actionResetRefillTypeAndSetInStore,
} from 'redux-main/reducers/modules/refill_type/actions_refill_type';
import { actionGetAndSetInStoreCompany } from 'redux-main/reducers/modules/company/actions';
import { actionGetAndSetInStoreMoscowTimeServer } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import * as fuelCardsActions from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import ChangeStatusRequesFormLazy from 'components/new/pages/edc_request/form/changeStatusRequesForm';
import { canSaveTest } from 'components/@next/@form/validate/validate';
import {
  actionGetWaybillById,
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
import { createValidDateTime, getTomorrow9amMoscowServerTime } from 'components/@next/@utils/dates/dates';
import { hasMotohours } from 'utils/functions';
import { IStateCompany } from 'redux-main/reducers/modules/company/@types';
import { ELECTRICAL_ENGINE_TYPE_ID, GAS_ENGINE_TYPE_ID } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/engine_data/FieldSelectEngine';
import { gasDefaultElement, electricalDefaultElement } from 'components/new/pages/waybill/form/context/utils';

const canSaveNotCheckField = [
  'fact_arrival_date',
  'fact_departure_date',
  'fuel_end',
  'gas_fuel_end',
  'distance',
  'motohours_equip_end',
  'equipment_tax_data',
  'gas_tax_data',
  'tax_data',
  'motohours_end',
  'odometr_end',
  'equipment_fact_fuel_end',
  'fact_fuel_end',
  'gas_fact_fuel_end',
  'fuel_given',
  'gas_fuel_given',
  'equipment_fuel_given',
  'is_no_fuel_refill',
  'is_no_gas_refill',
  'is_no_equipment_refill',
  'is_no_electrical_refill',
];

const canCloseNotCheckField = [
  'distance',
  'is_no_fuel_refill',
  'is_no_gas_refill',
  'is_no_equipment_refill',
  'is_no_electrical_refill',
];

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
      waybill.odometr_diff = value &&  waybill.odometr_end
        ? waybill.odometr_end - waybill.odometr_start
        : null;
    }
    // Если изменилось поле "Моточасы.Возврат" то считаем "Моточасы.Пробег"
    if (field === 'motohours_end' || field === 'motohours_start') {
      waybill.motohours_diff = value && waybill.motohours_end
        ? waybill.motohours_end - waybill.motohours_start
        : null;
    }
    // Если изменилось поле "Моточасы.Оборудование.Возврат" то считаем "Моточасы.Оборудование.пробег"
    if (field === 'motohours_equip_end' || field === 'motohours_equip_start') {
      waybill.motohours_equip_diff = value && waybill.motohours_equip_end
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

const checkDataForRefill = new Set(['car_refill', 'equipment_refill', 'gas_refill', 'electrical_refill'],);

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
  userCompanies: InitialStateSession['userData']['companies'];
  fuelCardsList: Array<FuelCard>;
  refillTypeList: Array<RefillType>;
  carList: Array<Car>;
  carIndex: Record<Car['asuods_id'], Car>;
  companyList: IStateCompany['companyList'];
  employeeIndex: Record<Employee['id'], Employee>;
  equipmentFuelCardsList: Array<FuelCard>;
  gasFuelCardsList: Array<FuelCard>;
  electricalFuelCardsList: Array<FuelCard>;
  notFiltredFuelCardsIndex: Record<FuelCard['id'], FuelCard>;
  moscowTimeServer: IStateSomeUniq['moscowTimeServer'];
  selectedMissions: IStateSomeUniq['selectedMissionsList'];
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
  defaultCarData?: {car_id: number; model_id: number; gov_number: string;};
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
      usePouring: false,
      name: 'waybillFormWrap',
      isPermittedByKey: {
        update: props.currentUser.permissionsSet.has(waybillPermissions.update),
        departure_and_arrival_values: props.currentUser.permissionsSet.has(
          waybillPermissions.departure_and_arrival_values,
        ),
        refill: props.currentUser.permissionsSet.has(waybillPermissions.refill),
        update_closed: props.currentUser.permissionsSet.has(waybillPermissions.update_closed),
        change_departure: props.currentUser.permissionsSet.has(waybillPermissions.change_departure),
      },
      // edcRequestIds: [{ request_id: 37, request_number: '202020209', }],
      edcRequestIds: null,
      timeId: null, // id таймера
      taxesTotalValueError: false,
      gasTaxesTotalValueError: false,
      electricalTaxesTotalValueError: false,
      equipmentTaxesTotalValueError: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props !== prevProps 
      || this.state.taxesTotalValueError !== prevState.taxesTotalValueError
      || this.state.gasTaxesTotalValueError !== prevState.gasTaxesTotalValueError
      || this.state.equipmentTaxesTotalValueError !== prevState.equipmentTaxesTotalValueError
      || this.state.electricalTaxesTotalValueError !== prevState.electricalTaxesTotalValueError
    ) {
      this.handleMultipleChange({});
    }
  }

  async componentDidMount() {
    this.props.dispatch(actionLoadRefillTypeAndSetInStore({}, this.props));
    this.props.dispatch(fuelCardsActions.actionLoadOriginFuelCardsGetAndSetInStore(this.props));
    await this.props.dispatch(actionGetAndSetInStoreMoscowTimeServer({}, this.props));
    await this.props.dispatch(actionGetAndSetInStoreCompany({}, this.props));

    const currentDate = new Date();

    timeIdGlobal = setTimeout(
      () => this.checkError(),
      (60 - currentDate.getSeconds()) * 1000,
    );

    const company = this.props.companyList.find((company) => company.company_id === this.props.userCompanyId);
    this.setState({
      usePouring: company.use_pouring,
    });

    if (this.props.element === null) {
      const defaultBill: any = getDefaultBill({
        company_id: this.props.currentUser.company_id,
      });
      defaultBill.structure_id = this.props.currentUser.structure_id;
      defaultBill.plan_departure_date = createValidDateTime(this.props.moscowTimeServer.date);
      defaultBill.plan_arrival_date = createValidDateTime(getTomorrow9amMoscowServerTime(this.props.moscowTimeServer.date));

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
      if (!waybill.gas_tax_data) {
        waybill.gas_tax_data = [];
      }
      if (!waybill.electrical_tax_data) {
        waybill.electrical_tax_data = [];
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
        const gasFuelStart = !isNullOrUndefined(waybill.gas_fuel_start)
          ? parseFloat(waybill.gas_fuel_start.toString())
          : 0;
        const electricalFuelStart = !isNullOrUndefined(waybill.electrical_fuel_start)
          ? parseFloat(waybill.electrical_fuel_start.toString())
          : 0;
        const fuelGiven = !isNullOrUndefined(waybill.fuel_given)
          ? parseFloat(waybill.fuel_given.toString())
          : 0;
        const gasFuelGiven = !isNullOrUndefined(waybill.gas_fuel_given)
          ? parseFloat(waybill.gas_fuel_given.toString())
          : 0;
        const electricalFuelGiven = !isNullOrUndefined(waybill.electrical_fuel_given)
          ? parseFloat(waybill.electrical_fuel_given.toString())
          : 0;
        const fuelTaxes = Taxes.calculateFinalResult(waybill.tax_data);

        const gasFuelTaxes = Taxes.calculateFinalResult(waybill.gas_tax_data);
        const electricalFuelTaxes = Taxes.calculateFinalResult(waybill.electrical_tax_data);
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
          waybill.gas_fuel_end = parseFloatWithFixed((
            gasFuelStart
            + gasFuelGiven
            - gasFuelTaxes
            - equipmentFuelTaxes
          ), 3);
          waybill.electrical_fuel_end = parseFloatWithFixed((
            electricalFuelStart
            + electricalFuelGiven
            - electricalFuelTaxes
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
              )
              && !this.state.taxesTotalValueError
              && !this.state.gasTaxesTotalValueError
              && !this.state.equipmentTaxesTotalValueError
              && !this.state.electricalTaxesTotalValueError,
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
            && canSaveTestWrap(this.state.formErrors)
            && !this.state.taxesTotalValueError
            && !this.state.gasTaxesTotalValueError
            && !this.state.equipmentTaxesTotalValueError
            && !this.state.electricalTaxesTotalValueError,
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

  getWaybill = async (id) => {
    try {
      const result = await this.props.dispatch(
        actionGetWaybillById(id, this.props),
      );
      return result;
    } catch (e) {
      throw new Error(e);
    }
  };
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

  handleFieldsChange = async (formState) => {
    let { formErrors } = this.state;
    const { gasTaxesTotalValueError, taxesTotalValueError, equipmentTaxesTotalValueError, electricalTaxesTotalValueError } = this.state;
    const newState: Partial<State> = {};

    formState.fuel_start = formState.fuel_start
      ? parseFloat(formState.fuel_start)
      : formState.fuel_start;
    formState.fuel_given = formState.fuel_given
      ? parseFloat(formState.fuel_given)
      : formState.fuel_given;
    formState.gas_fuel_start = formState.gas_fuel_start
      ? parseFloat(formState.gas_fuel_start)
      : formState.gas_fuel_start;
    formState.electrical_fuel_start = formState.electrical_fuel_start
      ? parseFloat(formState.electrical_fuel_start)
      : formState.electrical_fuel_start;
    formState.gas_fuel_given = formState.gas_fuel_given
      ? parseFloat(formState.gas_fuel_given)
      : formState.gas_fuel_given;
    formState.electrical_fuel_given = formState.electrical_fuel_given
      ? parseFloat(formState.electrical_fuel_given)
      : formState.electrical_fuel_given;
    formState.equipment_fuel_start = formState.equipment_fuel_start
      ? parseFloat(formState.equipment_fuel_start)
      : formState.equipment_fuel_start;
    formState.equipment_fuel_given = formState.equipment_fuel_given
      ? parseFloat(formState.equipment_fuel_given)
      : formState.equipment_fuel_given;
    
    if(isNullOrUndefined(formState.fuel_given)) {
      formState.fuel_given = 0;
    }
    if(isNullOrUndefined(formState.gas_fuel_given)) {
      formState.gas_fuel_given = 0;
    }
    if(isNullOrUndefined(formState.electrical_fuel_given)) {
      formState.electrical_fuel_given = 0;
    }

    const fuelStart = formState.fuel_start
      ? parseFloat(formState.fuel_start)
      : 0;
    const gasFuelStart = formState.gas_fuel_start
      ? parseFloat(formState.gas_fuel_start)
      : 0;
    const electricalFuelStart = formState.electrical_fuel_start
      ? parseFloat(formState.electrical_fuel_start)
      : 0;
    const fuelGiven = formState.fuel_given
      ? parseFloat(formState.fuel_given)
      : 0;
    const gasFuelGiven = formState.gas_fuel_given
      ? parseFloat(formState.gas_fuel_given)
      : 0;
    const electricalFuelGiven = formState.electrical_fuel_given
      ? parseFloat(formState.electrical_fuel_given)
      : 0;
    const fuelTaxes = Taxes.calculateFinalResult(formState.tax_data);
    const gasFuelTaxes = Taxes.calculateFinalResult(formState.gas_tax_data);
    const electricalFuelTaxes = Taxes.calculateFinalResult(formState.electrical_tax_data);
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
    formState.gas_tax_consumption = formState.is_one_fuel_tank && formState.equipment_fuel
      ? parseFloatWithFixed(equipmentFuelTaxes + gasFuelTaxes, 3)
      : parseFloatWithFixed(gasFuelTaxes, 3);
    formState.electrical_tax_consumption = formState.is_one_fuel_tank && formState.equipment_fuel
      ? parseFloatWithFixed(equipmentFuelTaxes + electricalFuelTaxes, 3)
      : parseFloatWithFixed(electricalFuelTaxes, 3);
    formState.equipment_fact_consumption = parseFloatWithFixed((
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
      formState.equipment_diff_consumption = Math.abs(
        parseFloatWithFixed((
          formState.equipment_tax_consumption
          - formState.equipment_fact_consumption
        ), 3)
      );
    } else {
      formState.fuel_end = parseFloatWithFixed((
        fuelStart
        + fuelGiven
        - fuelTaxes
        - equipmentFuelTaxes
      ), 3);
      formState.gas_fuel_end = parseFloatWithFixed((
        gasFuelStart
        + gasFuelGiven
        - gasFuelTaxes
        - equipmentFuelTaxes
      ), 3);
      formState.electrical_fuel_end = parseFloatWithFixed((
        electricalFuelStart
        + electricalFuelGiven
        - electricalFuelTaxes
        - equipmentFuelTaxes
      ), 3);
    }

    formState.fact_consumption = parseFloatWithFixed((
      fuelStart
      + fuelGiven
      - formState.fact_fuel_end
    ), 3);
    formState.gas_fact_consumption = parseFloatWithFixed((
      gasFuelStart
      + gasFuelGiven
      - formState.gas_fact_fuel_end
    ), 3);
    formState.electrical_fact_consumption = parseFloatWithFixed((
      electricalFuelStart
      + electricalFuelGiven
      - formState.electrical_fact_fuel_end
    ), 3);
    formState.diff_consumption = Math.abs(
      parseFloatWithFixed((
        formState.tax_consumption
        - formState.fact_consumption
      ), 3)
    );
    formState.gas_diff_consumption = Math.abs(
      parseFloatWithFixed((
        formState.gas_tax_consumption
        - formState.gas_fact_consumption
      ), 3)
    );
    formState.electrical_diff_consumption = Math.abs(
      parseFloatWithFixed((
        formState.electrical_tax_consumption
        - formState.electrical_fact_consumption
      ), 3)
    );

    if (!formState.status || formState.status === 'draft') {
      this.schema = waybillSchema;
    } else if (formState.status && formState.status !== 'draft') {
      this.schema = waybillClosingSchema;
    }

    const isGasKind = formState.engine_kind_ids?.includes(GAS_ENGINE_TYPE_ID);
    const isElectricalKind = formState.engine_kind_ids?.includes(ELECTRICAL_ENGINE_TYPE_ID);
    if(isGasKind || isElectricalKind) {
      // чистим поля со спец. оборудованием
      formState.equipment_fact_fuel_end = null;
      formState.equipment_fuel = false;
      formState.equipment_fuel_end = null;
      formState.equipment_fuel_given = null;
      formState.equipment_fuel_start = null;
      formState.equipment_fuel_to_give = null;
      formState.equipment_fuel_type = null;
      formState.equipment_refill = [];
      formState.equipment_tax_data = [];
      formState.is_one_fuel_tank = false;
      formState.equipment_diff_consumption = null;
      formState.equipment_fact_consumption = null;

      if(isGasKind) {
        // чистим поля с электричеством
        Object.keys(electricalDefaultElement).forEach((key) => {
          formState[key] = electricalDefaultElement[key];
        });
      } else {
        // чистим поля с газом
        Object.keys(gasDefaultElement).forEach((key) => {
          formState[key] = gasDefaultElement[key];
        });
      }
    } else {
      // чистим поля с газом <<< сделать через Object
      Object.keys(gasDefaultElement).forEach((key) => {
        formState[key] = gasDefaultElement[key];
      });
      Object.keys(electricalDefaultElement).forEach((key) => {
        formState[key] = electricalDefaultElement[key];
      });
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
      )
      && !taxesTotalValueError
      && !gasTaxesTotalValueError
      && !equipmentTaxesTotalValueError
      && !electricalTaxesTotalValueError;
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
      )
      && !this.state.taxesTotalValueError
      && !this.state.gasTaxesTotalValueError
      && !this.state.equipmentTaxesTotalValueError
      && !this.state.electricalTaxesTotalValueError;
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

  handleFormFileChange = (key, filesByKey) => {
    const { files } = this.state.formState;

    let formState = cloneDeep(this.state.formState);

    if (!files) {
      let addFiles = [
        ...filesByKey.map(
          (rowData) => ({
            ...rowData,
            kind: key,
          }),
        ),
      ];
      this.handleFieldsChange({
        ...formState,
        files: addFiles,
      });
    } else {
      let deletedBase64Files = filesByKey.filter((file) => file.action !== 'delete' && !isNullOrUndefined(file.nativeFile));
      let deletedFiles = filesByKey.filter((file) => file.action === 'delete' && !isNullOrUndefined(file.id));
      let savedFiles = deletedFiles ? filesByKey : deletedBase64Files;
      let newFiles = [
        ...files.filter((file) => file.kind !== key),
        ...savedFiles.map(
          (rowData) => ({
            ...rowData,
            kind: key,
          }),
        ),
      ];
      this.handleFieldsChange({
        ...formState,
        files: newFiles,
      });
    }
  };

  calcTaxDataFieldForChange = (
    tax_data: Waybill['gas_tax_data'] | Waybill['tax_data'] | Waybill['electrical_tax_data'],
    formState,
    field,
    index,
  ) => {
    const motohoursMain = hasMotohours(formState.gov_number);
    const elemMeasureUnitName = motohoursMain ? 'л/моточас' : 'л/км';
    const firstElemIndex = tax_data.findIndex((el) => el.measure_unit_name === elemMeasureUnitName);
    const isGasKind = formState.engine_kind_ids?.includes(GAS_ENGINE_TYPE_ID);

    tax_data.forEach((currElem) => {
      const isFirstElemTaxOperationField = (field === 'taxes_operation' || field === 'gas_taxes_operation' || field === 'electrical_taxes_operation') && index === firstElemIndex;
      
      if (
        (field === 'odometr_end' || isFirstElemTaxOperationField || field === 'odometr_start')
            && currElem.measure_unit_name !== 'л/моточас'
            && formState.odometr_diff >= 0
            && (currElem.measure_unit_name === 'л/км')
      ) {
        if (currElem.is_excluding_mileage) {
          currElem.iem_FACT_VALUE = !isGasKind
            ? formState.odometr_diff
            : currElem.iem_FACT_VALUE;
        } else {
          if(!isGasKind){
            currElem.FACT_VALUE = formState.odometr_diff > 0
              ? formState.odometr_diff
              : null;
          }
          currElem.RESULT = Taxes.getResult(currElem);
        }
      }
      if (
        (field === 'motohours_end' || isFirstElemTaxOperationField || field === 'motohours_start')
            && currElem.measure_unit_name !== 'л/км'
            && formState.motohours_diff >= 0
            && (currElem.measure_unit_name === 'л/моточас')
      ) {
        if (currElem.is_excluding_mileage) {
          if(!isGasKind){
            currElem.iem_FACT_VALUE = formState.motohours_diff;
          }
        } else {
          if(!isGasKind){
            currElem.FACT_VALUE = formState.motohours_diff > 0 ? formState.motohours_diff : null;
          }
          currElem.RESULT = Taxes.getResult(currElem);
        }
      }
      if (
        currElem.measure_unit_name !== 'л/моточас'
            && (currElem.measure_unit_name === 'л/км')
            && formState.odometr_diff <= 0
            && isFirstElemTaxOperationField
      ) {
        if (currElem.is_excluding_mileage) {
          if(!isGasKind){
            currElem.iem_FACT_VALUE = formState.odometr_diff;
          }
        } else {
          currElem.FACT_VALUE = null;
          currElem.RESULT = Taxes.getResult(currElem);
        }
      }

      if (
        currElem.measure_unit_name !== 'л/км'
            && (currElem.measure_unit_name === 'л/моточас')
            && formState.motohours_diff <= 0
            && isFirstElemTaxOperationField
      ) {
        if (currElem.is_excluding_mileage) {
          if(!isGasKind){
            currElem.iem_FACT_VALUE = formState.motohours_diff;
          }
        } else {
          if(!isGasKind){
            currElem.FACT_VALUE = null;
          }
          currElem.RESULT = Taxes.getResult(currElem);
        }
      }
    });
  };

  handleFormStateChange = (field, e, index) => {
    const value = get(e, ['target', 'value'], e);
    let formState = cloneDeep(this.state.formState);
    formState[field] = value;
    console.info(field, value); // eslint-disable-line
    formState = calculateWaybillMetersDiff(formState, field, value);
    // TODO при формировании FACT_VALUE считать diff - finalFactValue
    if (formState.tax_data && formState.tax_data.length) {
      this.calcTaxDataFieldForChange(formState.tax_data, formState, field, index);
    }
    if (formState.gas_tax_data && formState.gas_tax_data.length) {
      this.calcTaxDataFieldForChange(formState.gas_tax_data, formState, field, index);
    } 
    if (formState.electrical_tax_data && formState.electrical_tax_data.length) {
      this.calcTaxDataFieldForChange(formState.electrical_tax_data, formState, field, index);
    } 
    
    if (formState.equipment_tax_data && formState.equipment_tax_data.length ) {
      
      const formStateEquipmentTaxDataFirstElem = formState.equipment_tax_data[0];
      const isFirstElemEquipmentTaxOperationField = field === 'equipment_taxes_operation' && index === 0;
      if(
        isFirstElemEquipmentTaxOperationField
          && formState.motohours_equip_diff > 0
      ) {
        formStateEquipmentTaxDataFirstElem.FACT_VALUE = formState.motohours_equip_diff;
        formStateEquipmentTaxDataFirstElem.RESULT = EquipmentTaxes.getResult(formStateEquipmentTaxDataFirstElem);
      } else if (
        (field === 'motohours_equip_end' || field === 'motohours_equip_start')
          && formStateEquipmentTaxDataFirstElem.OPERATION
      ) {
        formStateEquipmentTaxDataFirstElem.FACT_VALUE = formState.motohours_equip_diff > 0 ? formState.motohours_equip_diff : null;
        formStateEquipmentTaxDataFirstElem.RESULT = EquipmentTaxes.getResult(formStateEquipmentTaxDataFirstElem);
      }
    }
    this.handleFieldsChange(formState);
  };

    clearSomeData = () => {
      const formState = cloneDeep(this.state.formState);

      delete formState.equipment_fuel_start;
      delete formState.fuel_start;
      delete formState.gas_fuel_start;
      delete formState.electrical_fuel_start;
      delete formState.motohours_equip_start;

      formState.car_has_motohours = null;
      formState.car_has_odometr = null;

      // prettier-ignore
      console.info( // eslint-disable-line
        'delete fields',
        '----->',
        'equipment_fuel_start',
        'fuel_start',
        'gas_fuel_start',
        'electrical_fuel_start',
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
      if (formState) {
        this.handleFieldsChange(formState);
      }
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
          const newState = await this.getWaybill(id);

          try {
            newState.status = 'active';

            await this.updateWaybill({...newState, is_bnso_broken: formState.is_bnso_broken});
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
            const r = await this.createWaybill(formState);
            const [{ id }] = get(r, 'result', [{ id: null }]) || [{ id: null }];
            return id;
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
      const { 
        gov_number,
        motohours_diff,
        odometr_diff, 
      } = this.state.formState;

      const {
        is_no_fuel_refill,
        is_no_gas_refill,
        is_no_equipment_refill,
        is_no_electrical_refill,
      } = this.state.formErrors;

      const govNumberRegExp = /^[\d]{4}/;
      const checkTaxesControl = Boolean(govNumberRegExp.exec(gov_number)) ? motohours_diff > 0 : odometr_diff > 0;
      if (!taxesControl && checkTaxesControl) {
        global.NOTIFICATION_SYSTEM.notify(
          getWarningNotification(
            'Необходимо заполнить нормы для расчета топлива!',
          ),
        );
        return;
      }
      if (is_no_fuel_refill || is_no_gas_refill || is_no_equipment_refill || is_no_electrical_refill) {
        const carOrEquipmentText = (is_no_fuel_refill || is_no_gas_refill || is_no_electrical_refill) ? 'Транспортное средство' : 'Спецоборудование';
        const fuelTypeText = is_no_fuel_refill ? 'Топливо' : is_no_gas_refill ? 'Газ' : is_no_electrical_refill ? 'ЭЭ' : 'Топливо для оборудования';
        global.NOTIFICATION_SYSTEM.notify(
          getWarningNotification(
            `${carOrEquipmentText}. ${fuelTypeText}. Добавьте заправку или укажите, что ее не было`,
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

    setTotalValueError = (key: string, totalValueError: boolean) => {
      this.setState({[key]: totalValueError});
    };

    render() {
      return (
        <React.Fragment>
          {this.state.formState && (
            <WaybillForm
              formState={this.state.formState}
              handleFormChange={this.handleFormStateChange}
              handleFormFileChange={this.handleFormFileChange}
              handleMultipleChange={this.handleMultipleChange}
              onSubmitActiveWaybill={this.submitActiveWaybill}
              onSubmit={this.handleFormSubmit}
              clearSomeData={this.clearSomeData}
              handleClose={this.handleClose}
              handlePrint={this.handlePrint}
              handlePrintFromMiniButton={this.handlePrintFromMiniButton}
              setEdcRequestIds={this.setEdcRequestIds}
              formErrors={{
                ...this.state.formErrors,
                gasTaxesTotalValueError: this.state.gasTaxesTotalValueError,
                taxesTotalValueError: this.state.taxesTotalValueError,
                electricalTaxesTotalValueError: this.state.electricalTaxesTotalValueError,
              }}
              entity={'waybill'}
              usePouring={this.state.usePouring}
              isPermittedByKey={this.state.isPermittedByKey}
              canClose={this.state.canClose}
              canSave={this.state.canSave}
              setTotalValueError={this.setTotalValueError}
              show
              onHide={this.onFormHide}
              page={this.props.page}
              path={this.props.path}
              defaultCarData={this.props.defaultCarData}
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
    userCompanies: getSessionState(state).userData.companies,
    userStructureId: getSessionState(state).userData.structure_id,
    fuelCardsList: getAutobaseState(state).fuelCardsList, // Используется в схеме валидации
    refillTypeList: getSomeUniqState(state).refillTypeList,
    carList: getAutobaseState(state).carList,
    carIndex: getAutobaseState(state).carIndex,
    employeeIndex: getEmployeeState(state).employeeIndex,
    equipmentFuelCardsList: getAutobaseState(state).equipmentFuelCardsList, // // Используется в схеме валидации
    gasFuelCardsList: getAutobaseState(state).gasFuelCardsList, // // Используется в схеме валидации
    electricalFuelCardsList: getAutobaseState(state).electricalFuelCardsList,
    notFiltredFuelCardsIndex: getAutobaseState(state).notFiltredFuelCardsIndex,
    moscowTimeServer: state.some_uniq.moscowTimeServer,
    companyList: getCompanyState(state).companyList,
    selectedMissions: getSomeUniqState(state).selectedMissionsList,
  }),
)(WaybillFormWrap);
