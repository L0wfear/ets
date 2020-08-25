import * as React from 'react';
import memoize from 'memoize-one';
import { isEqual, find, keyBy, map, uniqBy, groupBy, get } from 'lodash';
import { isNullOrUndefined, isNumber, isBoolean, isArray } from 'util';
import { connect } from 'react-redux';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { FileField } from 'components/old/ui/input/fields';

import Div from 'components/old/ui/Div';
import { isNotNull, isEmpty, hasMotohours } from 'utils/functions';

import { employeeFIOLabelFunction } from 'utils/labelFunctions';
import {
  notifications,
  getWarningNotification,
  getServerErrorNotification,
} from 'utils/notifications';
import { diffDates } from 'components/@next/@utils/dates/dates';

import {
  checkDateMission,
  checkMissionSelectBeforeClose,
  getCars,
  getDatesToByOrderOperationId,
  getDrivers,
  getFuelCorrectionRate,
  getTitleByStatus,
  getTrailers,
  getWaybillDrivers,
  validateTaxesControl,
  vehicleMapper,
  getFuelRatesBySeason,
} from 'components/old/waybill/utils';

import { confirmDialogChangeDate } from 'components/old/waybill/utils_react';

import {
  defaultSortingFunction,
  defaultSelectListMapper,
} from 'components/old/ui/input/ReactSelect/utils';

import EquipmentTaxes from 'components/old/waybill/EquipmentTaxes';

import WaybillFooter from 'components/old/waybill/form/WaybillFooter';
import BsnoStatus from 'components/old/waybill/form/BsnoStatus';

import MissionField from 'components/old/waybill/form/MissionFiled';
import {
  getSessionState,
  getAutobaseState,
  getSomeUniqState,
  getEmployeeState,
} from 'redux-main/reducers/selectors';

import { BorderDash, FlexContainer, InfoBlock } from 'global-styled/global-styled';
import { getDefaultBill } from 'stores/WaybillsStore';

import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';
import FieldWaybillCarRefill from './table_input/FieldWaybillCarRefill';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import FuelType from './form/FuelType';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { actionLoadOrderById } from 'redux-main/reducers/modules/order/action-order';
import { actionsWorkMode } from 'redux-main/reducers/modules/some_uniq/work_mode/actions';

import {
  actionPostMissionReassignationParameters,
  actionPutMissionReassignationParameters,
} from 'redux-main/reducers/modules/missions/mission/actions';
import {
  carGetAndSetInStore,
  autobaseResetSetCar,
} from 'redux-main/reducers/modules/autobase/car/actions';
import {
  actionLoadFuelRatesByCarModel,
  fuelRatesGet,
  fuelOperationsGet,
  actionLoadEquipmentFuelRatesByCarModel,
} from 'redux-main/reducers/modules/fuel_rates/actions-fuelRates';
import { actionGetTrackInfo } from 'redux-main/reducers/modules/some_uniq/track/actions';
import {
  actionGetAndSetInStoreEmployeeBindedToCarService,
  employeeGetAndSetInStore,
} from 'redux-main/reducers/modules/employee/employee/actions';
import {
  actionGetLastClosedWaybill,
  actionGetLatestWaybillDriver,
  actionGetWaybillById,
  actionGetMissionsByCarAndDates,
} from 'redux-main/reducers/modules/waybill/waybill_actions';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { ReduxState } from 'redux-main/@types/state';
import { WorkMode } from 'redux-main/reducers/modules/some_uniq/work_mode/@types';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { EmployeeBindedToCar } from 'components/new/utils/context/loading/@types/by_service/employee_binded_to_car';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { WaybillDriver } from 'redux-main/reducers/modules/employee/driver/@types';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';
import { SingleUiElementWrapperStyled } from 'components/@next/@ui/renderFields/styled';
import styled from 'styled-components';
import { actionGetAndSetInStoreReasonList } from 'redux-main/reducers/modules/some_uniq/reason_list/actions';
import { getReasonList } from 'redux-main/reducers/modules/some_uniq/reason_list/selectors';
import FuelNavHeader from 'components/old/waybill/form/fuelTabs/FuelNavHeader';
import FuelBodyContainer from 'components/old/waybill/form/fuelTabs/FuelBodyContainer';
import GasBodyContainer from 'components/old/waybill/form/fuelTabs/GasBodyContainer';
import fuelKindFormTabKey, { TabBodyContainerStyled } from 'components/old/waybill/form/waybillFormTabConfig';
import WaybillEngineKind from 'components/old/waybill/form/WaybillEngineKind';
import { GAS_ENGINE_TYPE_ID, FUEL_ENGINE_TYPE_ID } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/engine_data/FieldSelectEngine';

export const FlexContainerStyled = styled(FlexContainer as any)`
  ${SingleUiElementWrapperStyled} {
    width: 100%;
  }
`;

// const MISSIONS_RESTRICTION_STATUS_LIST = ['active', 'draft'];

const fieldToCheckHasData = {
  equipment_fact_fuel_end: {
    type: 'field',
  },
  equipment_fuel_end: {
    type: 'field',
  },
  equipment_fuel_given: {
    type: 'field',
  },
  equipment_fuel_start: {
    type: 'field',
  },
  equipment_fuel_to_give: {
    type: 'field',
  },
  equipment_fuel_type: {
    type: 'field',
  },
  equipment_tax_data: {
    type: 'array',
  },
  gas_tax_data: {
    type: 'array',
  },
  tax_data: {
    type: 'array',
  },
  motohours_equip_end: {
    type: 'field',
  },
  motohours_equip_start: {
    type: 'field',
  },
};

const getClosedEquipmentData = (lastCarUsedWaybill) => {
  const fieldsToChange: Partial<Waybill> = {};
  if (lastCarUsedWaybill) {
    if (isNotNull(lastCarUsedWaybill.equipment_fact_fuel_end)) {
      fieldsToChange.equipment_fuel_start
        = lastCarUsedWaybill.equipment_fact_fuel_end;
      fieldsToChange.equipment_fact_fuel_end
        = fieldsToChange.equipment_fuel_start;
    }

    if (isNotNull(lastCarUsedWaybill.motohours_equip_end)) {
      fieldsToChange.motohours_equip_start
        = lastCarUsedWaybill.motohours_equip_end;
    }

    fieldsToChange.is_one_fuel_tank = lastCarUsedWaybill.is_one_fuel_tank; // <<< как узнать кто установил??? originState?

    if (!fieldsToChange.is_one_fuel_tank) {
      fieldsToChange.equipment_fuel_type
        = lastCarUsedWaybill.equipment_fuel_type;
    }

    fieldsToChange.equipment_fuel = hasWaybillEquipmentData(
      fieldsToChange,
      fieldToCheckHasData,
    );
  } else {
    fieldsToChange.equipment_fuel_type = null;
    fieldsToChange.equipment_fuel_end = null;
    fieldsToChange.is_one_fuel_tank = true;
  }

  return fieldsToChange;
};

const hasWaybillEquipmentData = (waybill, shema) => {
  if (waybill) {
    return Object.entries(shema).some(([fieldKey, { type }]: any) => {
      switch (type) {
        case 'field':
          return !isNullOrUndefined(waybill[fieldKey]);
        case 'array':
          return (
            isArray(waybill[fieldKey]) && Boolean(waybill[fieldKey].length)
          );
        default:
          throw new Error('not valid type of field');
      }
    });
  }
  return false;
};

const setEmptyFieldByKey = (shema) => {
  return Object.entries(shema).reduce((newObj, [fieldKey, { type }]: any) => {
    if (type === 'field') {
      newObj[fieldKey] = null;
    }
    if (type === 'array') {
      newObj[fieldKey] = [];
    }

    return newObj;
  }, {});
};

const modalKey = 'waybill';

type StateProps = {
  appConfig: InitialStateSession['appConfig'];
  userStructureId: InitialStateSession['userData']['structure_id'];
  userCompanyId: InitialStateSession['userData']['company_id'];
  userStructures: InitialStateSession['userData']['structures'];
  userPermissionsSet: InitialStateSession['userData']['permissionsSet'];
  fuelCardsList: Array<FuelCard>;
  equipmentFuelCardsList: Array<FuelCard>;
  gasFuelCardsList: Array<FuelCard>;
  workModeList: Array<WorkMode>;
  order_mission_source_id: IStateSomeUniq['missionSource']['order_mission_source_id'];
  carList: Array<Car>;
  carIndex: Record<Car['asuods_id'], Car>;
  uniqEmployeesBindedOnCarList: Array<EmployeeBindedToCar>;
  employeeList: Array<Employee>;
  employeeIndex: Record<Employee['id'], Employee>;
  waybillDriverList: Array<WaybillDriver>;
  moscowTimeServer: IStateSomeUniq['moscowTimeServer'];
  reasonListOptions: ReturnType<typeof getReasonList>;
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {
  formState: any;
  handleFormFileChange: (key: string, filesByKey: Array<any>) => any;
  handleFormChange: (field: string, e: any, idex?: number) => any;
  handleMultipleChange: (object: Record<string, any>) => any;
  onSubmitActiveWaybill: (closeForm?: boolean, state?: WaybillProps['formState']) => any;
  onSubmit: (...arg: Array<any>) => any;
  clearSomeData: () => any;

  handleClose: (...arg: any) => any;

  handlePrint: (...arg: Array<any>) => any;
  handlePrintFromMiniButton: (...arg: Array<any>) => any;

  setEdcRequestIds?: (arg: Array<{ request_id: number; request_number: string; }>) => any;
  setTotalValueError?: (key: string, totalValueError: boolean) => void;
  formErrors: Record<string, any>;
  entity: string;
  isPermittedByKey: {
    update: boolean;
    departure_and_arrival_values: boolean;
    refill: boolean;
    update_closed: boolean;
  };
  canClose: boolean;
  canSave: boolean;
  usePouring?: boolean;

  page: string;
  path?: string;
  defaultCarData?: {car_id: number; model_id: number; gov_number: string;};
  show: boolean;
  onHide: any;
};

export type WaybillProps = (
  StateProps
  & DispatchProps
  & OwnProps
);

export type WaybillState = {
  operations: Array<any>;
  gasOperations: Array<any>;
  equipmentOperations: Array<any>;
  fuelRates: Array<any>;
  gasFuelRates: Array<any>;
  equipmentFuelRates: Array<any>;
  fuel_correction_rate: number;
  canEditIfClose: boolean;
  loadingFields: Record<string, any>;
  fuelRateAllList: Array<any>;
  tooLongFactDates: boolean;
  missionsList: Array<any>;
  origMissionsList: Array<any>;

  notAvailableMissions: Array<any>;
  rejectMissionList: Array<any>;

  origFormState: WaybillProps['formState'];

  missionHasError: {
    hasError: boolean;
    errorText: string;
  };

  lastWaybill: Waybill;
  fuelActiveTabKey: string;
  isGasKind: boolean;
  isFuelKind: boolean;
  isElectricityKind: boolean;
};

class WaybillForm extends React.Component<WaybillProps, WaybillState> {
  constructor(props) {
    super(props);

    this.state = {
      operations: [],
      gasOperations: [],
      equipmentOperations: [],
      fuelRates: [],
      gasFuelRates: [],
      equipmentFuelRates: [],
      fuel_correction_rate: 1,
      canEditIfClose: null,
      loadingFields: {},
      fuelRateAllList: [],
      tooLongFactDates: false,
      missionsList: [],
      origMissionsList: [],
      notAvailableMissions: [],
      rejectMissionList: [],        // Массив с заданиями, которые надо будет отменить, формируется в missionField
      origFormState: {},
      missionHasError: {
        hasError: false,
        errorText: '',
      },
      lastWaybill: null,
      fuelActiveTabKey: fuelKindFormTabKey[0]?.tabKey,
      isGasKind: false,
      isFuelKind: true,
      isElectricityKind: false,
    };
  }

  componentDidUpdate(prevProps) {
    const oldFormState = prevProps.formState;
    const nextFormState = this.props.formState;
    if (nextFormState.car_id !== oldFormState.car_id && nextFormState.car_id) {
      this.getLatestWaybillDriver(nextFormState);
    }

    // при смене планируемых дат или ТС запрашиваются новые доступные задания
    if (
      oldFormState.car_id !== nextFormState.car_id
      || !isEqual(
        oldFormState.plan_arrival_date,
        nextFormState.plan_arrival_date,
      )
      || !isEqual(
        oldFormState.plan_departure_date,
        nextFormState.plan_departure_date,
      )
    ) {
      this.getMissionsByCarAndDates(
        nextFormState,
        oldFormState.car_id,
        oldFormState.car_id && nextFormState.car_id,
      );
    }
    if (
      oldFormState.status === 'active'
      && diffDates(
        nextFormState.fact_departure_date,
        nextFormState.fact_arrival_date,
        'minutes',
      ) <= 0
    ) {
      if (
        oldFormState.car_id !== nextFormState.car_id
        || !isEqual(
          oldFormState.fact_arrival_date,
          nextFormState.fact_arrival_date,
        )
        || !isEqual(
          oldFormState.fact_departure_date,
          nextFormState.fact_departure_date,
        )
      ) {
        this.getCarDistance(nextFormState);
        this.getMissionsByCarAndDates(
          nextFormState,
          oldFormState.car_id,
          oldFormState.car_id && nextFormState.car_id,
        );
      }
    }
  }

  setMissionHasError = (missionHasError: WaybillState['missionHasError']) => {
    this.setState({
      missionHasError: missionHasError,
    });
  };

  handleChange = (field, e, index = null) => this.props.handleFormChange(field, e, index);

  handleFileChange = (key, filesByKey) => this.props.handleFormFileChange(key, filesByKey);

  handleMultipleChange = (fields) => this.props.handleMultipleChange(fields);

  handleChangeOdometr = async () => {
    const {
      formState: { odometr_start, is_edited_odometr, odometr_reason_id, files },
    } = this.props;

    const eventClick = !is_edited_odometr ? 'pencil' : 'lock';
    const changeOdometrTrigger = Boolean(
      (odometr_start !== this.state?.lastWaybill?.odometr_end)
      || odometr_reason_id || files && files.some((file) => file.kind === 'odometr')
    );

    if (changeOdometrTrigger && eventClick !== 'pencil') {
      return global.confirmDialog({
        title: 'Внимание!',
        body: 'Заполненные поля в блоке «Изменение показателя выезда» будут удалены. Продолжить?',
        okName: 'Да',
        cancelName: 'Нет',
      }).then( () => {
        this.handleMultipleChange({
          odometr_start: this.state?.lastWaybill?.odometr_end,
          odometr_reason_id: null,
          files: files && files.map(
            (elem) => elem.kind === 'odometr' ? { ...elem, action: 'delete'} : {...elem}
          ),
          is_edited_odometr: false,
        });
      }).catch(() => {
        return;
      });
    } else {
      this.handleChange('is_edited_odometr', !is_edited_odometr);
    }
  };

  handleChangeMotohours = async () => {
    const {
      formState: { motohours_start, is_edited_motohours, motohours_reason_id, files },
    } = this.props;

    const eventClick = !is_edited_motohours ? 'pencil' : 'lock';
    const changeMotohoursTrigger = Boolean(
      (motohours_start !== this.state?.lastWaybill?.motohours_end)
      || motohours_reason_id || files && files.some((file) => file.kind === 'motohours')
    );

    if (changeMotohoursTrigger && eventClick !== 'pencil') {
      return global.confirmDialog({
        title: 'Внимание!',
        body: 'Заполненные поля в блоке «Изменение показателя выезда» будут удалены. Продолжить?',
        okName: 'Да',
        cancelName: 'Нет',
      }).then(() => {
        this.handleMultipleChange({
          motohours_start: this.state?.lastWaybill?.motohours_end,
          motohours_reason_id: null,
          files: files && files.map(
            (elem) => elem.kind === 'motohours' ? { ...elem, action: 'delete'} : {...elem}
          ),
          is_edited_motohours: false,
        });
      }).catch((e) => {
        console.error(e);
        return;
      });
    } else {
      this.handleChange('is_edited_motohours', !is_edited_motohours);
    }
  };

  handleChangeEquip = async () => {
    const {
      formState: { motohours_equip_start, is_edited_motohours_equip, motohours_equip_reason_id, files },
    } = this.props;

    const eventClick = !is_edited_motohours_equip ? 'pencil' : 'lock';
    const changeMotohoursTrigger = Boolean(
      (motohours_equip_start !== this.state?.lastWaybill?.motohours_equip_end)
      || motohours_equip_reason_id || files && files.some((file) => file.kind === 'motohours_equip')
    );

    if (changeMotohoursTrigger && eventClick !== 'pencil' ) {
      return global.confirmDialog({
        title: 'Внимание!',
        body: 'Заполненные поля в блоке «Изменение показателя выезда» будут удалены. Продолжить?',
        okName: 'Да',
        cancelName: 'Нет',
      }).then(() => {
        this.handleMultipleChange({
          motohours_equip_start: this.state?.lastWaybill?.motohours_equip_end,
          motohours_equip_reason_id: null,
          files: files && files.map(
            (elem) => elem.kind === 'motohours_equip' ? { ...elem, action: 'delete'} : {...elem}
          ),
          is_edited_motohours_equip: false,
        });
      }).catch(() => {
        return;
      });
    } else {
      this.handleChange('is_edited_motohours_equip', !is_edited_motohours_equip);
    }
  };

  setIsGasKind = (isGasKind) => {
    this.setState({
      isGasKind,
    });
  };
  setIsFuelKind = (isFuelKind) => {
    this.setState({
      isFuelKind,
    });
  };
  setIsElectricityKind = (isElectricityKind) => {
    this.setState({
      isElectricityKind,
    });
  };

  async componentDidMount() {
    const {
      formState,
      formState: { status, car_id },
    } = this.props;

    const IS_CREATING = !status;
    const IS_DRAFT = status === 'draft';
    const IS_ACTIVE = status === 'active' || status === 'deleted'; // Удален это признак, по факту статус ПЛ, активен
    const IS_CLOSED = status === 'closed';
    const IS_DELETE = status === 'deleted';

    this.getMissionsByCarAndDates(formState, formState.car_id, false);

    await Promise.all([
      this.props.dispatch(carGetAndSetInStore({}, this.props)),
      this.props.dispatch(employeeGetAndSetInStore({}, this.props)),
      this.props.dispatch(
        actionsWorkMode.getArrayAndSetInStore({}, this.props),
      ),
      this.props.dispatch(actionGetAndSetInStoreReasonList({}, this.props)),
      getWaybillDrivers(
        this.props.dispatch,
        this.props.formState,
        this.props,
      ),
    ]);

    if (IS_CREATING || IS_DRAFT) {
      this.props
        .dispatch(fuelRatesGet({}, this.props))
        .then(({ fuelRatesList }) => 
          this.setState({
            fuelRateAllList: fuelRatesList.map((d) => d.car_model_id),
          }),
        )
        .catch((e) => {
          console.error(e);  // eslint-disable-line
          this.setState({
            fuelRateAllList: [],
          });
        })
        .finally(() => {
          if(this.props.defaultCarData) {
            this.onCarChange(
              this.props.defaultCarData.car_id, 
              {
                model_id: this.props.defaultCarData.model_id, 
                gov_number: this.props.defaultCarData.gov_number
              }
            );
          }
        });
    }

    if (!IS_CREATING) {
      await this.props
        .dispatch(actionGetWaybillById(formState.id, this.props))
        .then((waybill) => {
          this.handleMultipleChange(waybill); // Тут происходило перетирание полей, которые пересчитывались при рендере дочерних компонеетов
          this.setState({
            canEditIfClose: waybill.closed_editable
              ? this.props.userPermissionsSet.has('waybill.update_closed')
              : false,
            origFormState: formState,
          });
        })
        .catch((e) => {
          console.error(e);  // eslint-disable-line
          this.setState({
            canEditIfClose: false,
            origFormState: formState,
          });
        });
    }

    if (IS_ACTIVE || IS_CLOSED || IS_DELETE) {
      this.getCarDistance(formState);

      const currentSeason = this.props.formState.season;

      Promise.all([
        getFuelRatesBySeason(
          this.props.dispatch(
            actionLoadFuelRatesByCarModel(
              {
                car_id: formState.car_id,
                datetime: formState.activating_date,
                company_structure_id: formState.structure_id,
              },
              this.props,
            ),
          ),
          currentSeason,
        ),
        this.props
          .dispatch(fuelOperationsGet({ is_active: true }, this.props))
          .then(({ fuelRateOperations }) => fuelRateOperations),
        getFuelRatesBySeason(
          this.props.dispatch(
            actionLoadEquipmentFuelRatesByCarModel(
              {
                car_id: formState.car_id,
                datetime: formState.activating_date,
                company_structure_id: formState.structure_id,
              },
              this.props,
            ),
          ),
          currentSeason,
        ),
        getFuelCorrectionRate(this.props.carIndex, formState),
      ])
        .then(
          ([
            fuelRates,
            fuelOperationsList,
            equipmentFuelRates,
            fuel_correction_rate,
          ]) => {
            const fuelOperationsListById = keyBy(fuelOperationsList, 'id');
            const operations = fuelRates.reduce(
              (
                newArr,
                {
                  id,
                  operation_name,
                  operation_id,
                  is_excluding_mileage,
                  measure_unit_name,
                  rate_on_date,
                  comment,
                  engine_kind_id,
                },
              ) => {
                if (fuelOperationsListById[operation_id] && engine_kind_id === FUEL_ENGINE_TYPE_ID) {
                  newArr.push({
                    ...fuelOperationsListById[operation_id],
                    name: operation_name,
                    uniqKey: id,
                    rate_on_date,
                    comment,
                    measure_unit_name,
                    is_excluding_mileage,
                  });
                }

                return newArr;
              },
              [],
            );

            const gasOperations = fuelRates.reduce(
              (
                newArr,
                {
                  id,
                  operation_name,
                  operation_id,
                  is_excluding_mileage,
                  measure_unit_name,
                  rate_on_date,
                  comment,
                  engine_kind_id,
                },
              ) => {
                if (fuelOperationsListById[operation_id] && engine_kind_id === GAS_ENGINE_TYPE_ID) {
                  newArr.push({
                    ...fuelOperationsListById[operation_id],
                    name: operation_name,
                    uniqKey: id,
                    rate_on_date,
                    comment,
                    measure_unit_name,
                    is_excluding_mileage,
                  });
                }

                return newArr;
              },
              [],
            );

            const gasFuelRates = fuelRates.filter(
              ({ engine_kind_id }) => engine_kind_id === GAS_ENGINE_TYPE_ID
            );

            this.setState({
              fuelRates,
              gasFuelRates,
              operations,
              gasOperations,
              fuel_correction_rate,
              equipmentFuelRates,
              equipmentOperations: equipmentFuelRates.reduce(
                (
                  newArr,
                  {
                    id,
                    operation_name,
                    operation_id,
                    is_excluding_mileage,
                    measure_unit_name,
                    rate_on_date,
                    comment,
                  },
                ) => {
                  if (fuelOperationsListById[operation_id]) {
                    newArr.push({
                      ...fuelOperationsListById[operation_id],
                      name: operation_name,
                      uniqKey: id,
                      rate_on_date,
                      measure_unit_name,
                      is_excluding_mileage,
                      comment,
                    });
                  }

                  return newArr;
                },
                [],
              ),
            });

            this.handleChange(
              'hasEquipmentFuelRates',
              equipmentFuelRates.length,
            );
          },
        )
        .catch((e) => {
          console.error(e);  // eslint-disable-line

          this.setState({
            fuelRates: [],
            gasFuelRates: [],
            operations: [],
            gasOperations: [],
            fuel_correction_rate: 1,
            equipmentFuelRates: [],
            equipmentOperations: [],
          });
        });
    }
    
    if(car_id && (IS_CREATING || IS_DRAFT)) {
      await this.refresh(true, false);
    }

    if(car_id && IS_ACTIVE) {
      await this.props.dispatch(
        actionGetLastClosedWaybill({ car_id }, this.props),
      ).then((lastWaybill) => {
        this.setState({ lastWaybill, });
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch(autobaseResetSetCar());
  }

  handlePlanDepartureDates = (field, value) => {
    if (value === null) {
      return;
    }
    const { missionsList: oldMissionsList = [] } = this.state;
    const {
      formState,
      formState: { mission_id_list = [] },
    } = this.props;
    const dateWaybill = {
      plan_departure_date: formState.plan_departure_date,
      plan_arrival_date: formState.plan_arrival_date,
      [field]: value,
    };

    const missionsList = [...oldMissionsList];

    const { order_mission_source_id } = this.props;

    const missionsFromOrder = uniqBy(
      missionsList.concat(...this.state.notAvailableMissions),
      'id',
    ).reduce((missions, mission) => {
      if (
        formState.mission_id_list.includes(mission.id)
        && order_mission_source_id === mission.mission_source_id
      ) {
        missions.push(mission);
      }
      return missions;
    }, []);

    Promise.all(
      missionsFromOrder.map((mission) =>
        this.props
          .dispatch(actionLoadOrderById(mission.order_id, this.props))
          .then((dependeceOrder) => ({
            ...mission,
            ...getDatesToByOrderOperationId(
              dependeceOrder,
              mission.order_operation_id,
            ),
          })),
      ),
    )
      .then((missions) =>
        missions.reduce((newObj, { id, number, dateTo }) => {
          if (checkDateMission({ dateTo, dateWaybill })) {
            newObj[id] = number;
          }

          return newObj;
        }, {}),
      )
      .then((missionsWithSourceOrder) =>
        confirmDialogChangeDate(
          Object.values(missionsWithSourceOrder).map((num) => `задание ${num}`),
        )
          .then(() => {
            if (Object.keys(missionsWithSourceOrder).length) {
              this.handleChange(
                'mission_id_list',
                mission_id_list.filter((id) => !missionsWithSourceOrder[id]),
              );
              this.setState({
                missionsList: oldMissionsList.filter(
                  ({ id }) => !missionsWithSourceOrder[id],
                ),
              });
            }

            getWaybillDrivers(
              this.props.dispatch,
              {
                ...this.props.formState,
                [field]: value,
              },
              this.props,
            );
            this.handleChange(field, value);
          })
          .catch(() => {
            //
          }),
      );
  };

  getMissionsByCarAndDates = (formState, oldCarId, notificate) => {
    const { missionsList: oldMissionsList = [] } = this.state;
    const { car_id, mission_id_list: currentMissions, status } = formState;

    if (!car_id) {
      return;
    }

    this.props
      .dispatch(
        actionGetMissionsByCarAndDates(
          {
            car_id,
            date_from:
              formState.fact_departure_date || formState.plan_departure_date,
            date_to: formState.fact_arrival_date || formState.plan_arrival_date,
            status,
            waybill_id: formState.id,
          },
          this.props,
        ),
      )
      .then(({ result: { rows: newMissionsList = [] } = {} }) => {
        const missionsList = uniqBy(newMissionsList, 'id');
        const availableMissions = missionsList.map((el: any) => el.id);
        let { notAvailableMissions = [] } = this.state;

        let newMissionIdList = formState.mission_id_list;

        if (formState.car_id !== oldCarId) {
          newMissionIdList = currentMissions.filter((el) =>
            availableMissions.includes(el),
          );
        } else {
          notAvailableMissions = notAvailableMissions
            .concat(
              currentMissions
                .filter(
                  (el) =>
                    !availableMissions.includes(el)
                    && !notAvailableMissions.find((m) => m.id === el),
                )
                .map((id) => oldMissionsList.find((el) => el.id === id)),
            )
            .filter((m) => m);
        }

        this.handleChange('mission_id_list', newMissionIdList);

        if (
          !isEqual(oldMissionsList, missionsList)
          && availableMissions.length > 0
          && notificate
        ) {
          global.NOTIFICATION_SYSTEM.notify(
            notifications.missionsByCarAndDateUpdateNotification,
          );
        }

        this.setState({
          missionsList,
          notAvailableMissions,
          origMissionsList: missionsList,
        });
      });
  };

  getCarDistance = (formState) => {
    if (
      diffDates(
        formState.fact_arrival_date,
        formState.fact_departure_date,
        'days',
      ) > 3
    ) {
      this.setState({ tooLongFactDates: true });
      return;
    }
    const {
      loadingFields: { ...loadingFields },
    } = this.state;
    // Если ПЛ закрыт,то ничего не получаем
    if (formState.status === 'closed') {
      loadingFields.distance = false;
      loadingFields.consumption = false;
      loadingFields.sensor_consumption = false;
      loadingFields.sensor_refill = false;
      loadingFields.sensor_start_value = false;
      loadingFields.sensor_finish_value = false;
      this.setState({ loadingFields, tooLongFactDates: false });
      return;
    }

    const { fact_departure_date, fact_arrival_date } = formState;

    if (
      formState.car_id
      && fact_departure_date
      && fact_arrival_date
      && diffDates(fact_arrival_date, fact_departure_date) > 0
    ) {
      loadingFields.distance = true;
      loadingFields.consumption = true;
      loadingFields.sensor_consumption = true;
      loadingFields.sensor_refill = true;
      loadingFields.sensor_start_value = true;
      loadingFields.sensor_finish_value = true;
      this.setState({ loadingFields });

      this.props
        .dispatch(
          actionGetTrackInfo(
            {
              car_id: formState.car_id,
              from_dt: fact_departure_date,
              to_dt: fact_arrival_date,
            },
            this.props,
          ),
        )
        .then(({ distance, consumption, sensor_refill, sensor_start_value, sensor_finish_value,  }) => {
          this.props.handleMultipleChange({
            car_id: formState.car_id,
            distance: isNullOrUndefined(distance)
              ? null
              : parseFloat(distance),
            consumption: isNullOrUndefined(consumption)
              ? null
              : parseFloat(consumption),
            sensor_consumption: isNullOrUndefined(consumption)
              ? null
              : parseFloat(consumption),
            sensor_refill: isNullOrUndefined(sensor_refill)
              ? null
              : parseFloat(sensor_refill),
            sensor_start_value: isNullOrUndefined(sensor_start_value)
              ? null
              : parseFloat(sensor_start_value),
            sensor_finish_value: isNullOrUndefined(sensor_finish_value)
              ? null
              : parseFloat(sensor_finish_value),
            track_length: isNullOrUndefined(formState.track_length)
              ? isNullOrUndefined(distance)
                ? null
                : parseFloat(distance)
              : formState.track_length,
          });

          this.setState({
            loadingFields: {
              distance: false,
              consumption: false,
              sensor_consumption: false,
              sensor_refill: false,
              sensor_start_value: false,
              sensor_finish_value: false,
            },
          });
        })
        .catch(() => {
          this.setState({
            loadingFields: {
              distance: false,
              consumption: false,
              sensor_consumption: false,
              sensor_refill: false,
              sensor_start_value: false,
              sensor_finish_value: false,
            },
          });
        });
    } else {
      this.setState({
        loadingFields: {
          distance: false,
          consumption: false,
          sensor_consumption: false,
          sensor_refill: false,
        },
      });
    }
  };

  getLatestWaybillDriver = (formState) => {
    const { car_id } = formState;
    this.props.dispatch(
      actionGetAndSetInStoreEmployeeBindedToCarService(
        { asuods_id: car_id },
        this.props,
      ),
    );
    this.props
      .dispatch(
        actionGetLatestWaybillDriver(
          {
            car_id,
            driver_id: formState.driver_id,
          },
          this.props,
        ),
      )
      .then((driver_id) => {
        if (driver_id) {
          const DRIVERS = getDrivers(
            { ...formState, driver_id },
            this.props.employeeIndex,
            this.props.waybillDriverList,
          );

          if (DRIVERS.some(({ value }) => value === driver_id)) {
            this.props.handleFormChange('driver_id', driver_id);
          }
        } else {
          /**
           * Сбрасываем водителя, так как в новом, отфильтрованнои по ТС
           * списке, водителей может уже не быть.
           */
          this.props.handleFormChange('driver_id', null);
        }
      });
  };

  onCarChange = (car_id, selectedCar: any = {}) => {
    // https://gost-jira.atlassian.net/browse/DITETS-6607
    setTimeout(() => {
      new Promise((res) => {
        const structureIdCar = get(
          selectedCar,
          'rowData.company_structure_id',
          null,
        );
        const carIsCommon = get(selectedCar, 'rowData.is_common', false);

        const structure_id
          = structureIdCar && !carIsCommon
            ? structureIdCar
            : structureIdCar && carIsCommon && this.props.userStructureId
              ? this.props.userStructureId
              : get(this.props, 'formState.structure_id', null);

        const fieldsToChange = {
          car_id,
          gov_number: '',
          fuel_to_give: null,
          ...setEmptyFieldByKey(fieldToCheckHasData),
          equipment_fuel: getDefaultBill({}).equipment_fuel,
          equipment_fuel_type: null,
          structure_id,
          car_type_id: get(selectedCar, 'rowData.type_id', null),
          car_refill: [],
          gas_refill: [],
          equipment_refill: [],
        };

        if (!isEmpty(car_id)) {
          if (!this.state.fuelRateAllList.includes(selectedCar.model_id)) {
            global.NOTIFICATION_SYSTEM.notify(
              notifications.missionFuelRateByCarUpdateNotification,
            );
          }
          this.props.clearSomeData();
          return this.props
            .dispatch(actionGetLastClosedWaybill({ car_id }, this.props))
            .then((lastCarUsedWaybill) => {
              this.setState({ lastWaybill: lastCarUsedWaybill, });
              return res({
                ...fieldsToChange,
                ...this.getFieldsToChangeBasedOnLastWaybill(lastCarUsedWaybill),
                gov_number: selectedCar.gov_number,
              });
            },
            );
        }

        /**
         * Если ТС не выбрано, то и ранее выбранного водителя не должно быть.
         */
        return Promise.resolve(
          res({
            ...fieldsToChange,
            driver_id: null,
          }),
        );
      }).then((fieldsToChange) =>
        this.props.handleMultipleChange(fieldsToChange),
      );
    }, 0);
  };

  getFieldsToChangeBasedOnLastWaybill = (lastCarUsedWaybill) => {
    let fieldsToChange: any = {};
    if (isNotNull(lastCarUsedWaybill)) {
      if (isNotNull(lastCarUsedWaybill.fact_fuel_end)) {
        fieldsToChange.fuel_start = lastCarUsedWaybill.fact_fuel_end;
        fieldsToChange.fact_fuel_end = fieldsToChange.fuel_start;
      }
      if (isNotNull(lastCarUsedWaybill.gas_fact_fuel_end)) {
        fieldsToChange.gas_fuel_start = lastCarUsedWaybill.gas_fact_fuel_end;
        fieldsToChange.gas_fact_fuel_end = fieldsToChange.gas_fuel_start;
      }
      if (isNotNull(lastCarUsedWaybill.odometr_end)) {
        fieldsToChange.odometr_start = lastCarUsedWaybill.odometr_end;
      }
      if (isNotNull(lastCarUsedWaybill.motohours_end)) {
        fieldsToChange.motohours_start = lastCarUsedWaybill.motohours_end;
      }
      if (isNotNull(lastCarUsedWaybill.fuel_type)) {
        fieldsToChange.fuel_type = lastCarUsedWaybill.fuel_type;
      }
      if (isNotNull(lastCarUsedWaybill.gas_fuel_type)) {
        fieldsToChange.gas_fuel_type = lastCarUsedWaybill.gas_fuel_type;
      }
      if (isNotNull(lastCarUsedWaybill.trailer_id)) {
        const getTrailersByStructId = getTrailers(
          this.props.formState.structure_id,
          lastCarUsedWaybill.trailer_id,
        );
        const TRAILERS = getTrailersByStructId(this.props.carList);

        if (TRAILERS.find((c) => c.value === lastCarUsedWaybill.trailer_id)) {
          fieldsToChange.trailer_id = lastCarUsedWaybill.trailer_id;
        }
      }

      if(!isNotNull(this.props?.formState?.car_has_motohours)) {
        fieldsToChange.car_has_motohours = lastCarUsedWaybill.car_has_motohours;
        if(lastCarUsedWaybill.car_has_motohours){
          fieldsToChange.motohours_start = lastCarUsedWaybill?.motohours_end;
        }
      }

      if(!isNotNull(this.props?.formState?.car_has_odometr)) {
        fieldsToChange.car_has_odometr = lastCarUsedWaybill.car_has_odometr;
        if(lastCarUsedWaybill.car_has_odometr){
          fieldsToChange.odometr_start = lastCarUsedWaybill?.odometr_end;
        }
      }
      
    } else {
      fieldsToChange.fuel_start = 0;
      fieldsToChange.fact_fuel_end = fieldsToChange.fuel_start;
      fieldsToChange.gas_fuel_start = 0;
      fieldsToChange.gas_fact_fuel_end = fieldsToChange.gas_fuel_start;
      fieldsToChange.odometr_start = 0;
      fieldsToChange.motohours_start = null;
    }
    const lastWaybillEquipmentData = this.props.formState?.equipment_fuel_type 
      ? {...getClosedEquipmentData(lastCarUsedWaybill), equipment_fuel_type: this.props.formState?.equipment_fuel_type}
      : getClosedEquipmentData(lastCarUsedWaybill);

    fieldsToChange = {
      ...fieldsToChange,
      ...lastWaybillEquipmentData,
    };

    return fieldsToChange;
  };

  /**
   * Обновляет данные формы на основе закрытого ПЛ
   */
  refresh = async (autocompleteOnly: boolean = false, showInfo: boolean = true) => {
    const state = this.props.formState;
    const {
      is_edited_odometr, 
      is_edited_motohours, 
      is_edited_motohours_equip,
    } = this.props.formState;

    const plan_departure_date
      = diffDates(this.props.moscowTimeServer.date, state.plan_departure_date) > 0 && !autocompleteOnly
        ? this.props.moscowTimeServer.date
        : state.plan_departure_date;
    const trailer_id = state.trailer_id;
    try {
      const lastWaybill = await this.props.dispatch(
        actionGetLastClosedWaybill({ car_id: state.car_id }, this.props),
      );
      if(lastWaybill) {
        const is_one_fuel_tank = state.is_one_fuel_tank !== null && state.is_one_fuel_tank !== lastWaybill.is_one_fuel_tank
          ? state.is_one_fuel_tank
          : lastWaybill.is_one_fuel_tank;
        const equipment_fuel = state.equipment_fuel ?? lastWaybill.equipment_fuel;
        const odometr_start = is_edited_odometr || !isNotNull(lastWaybill.odometr_end)
          ? state.odometr_start
          : lastWaybill.odometr_end;
        const motohours_start = is_edited_motohours  || !isNotNull(lastWaybill.motohours_end)
          ? state.motohours_start
          : lastWaybill.motohours_end;
        const motohours_equip_start = is_edited_motohours_equip || !isNotNull(lastWaybill.motohours_equip_end)
          ? state.motohours_equip_start
          : lastWaybill.motohours_equip_end;

        const lastWaybillMod = {
          ...lastWaybill,
          is_one_fuel_tank,
        };

        this.setState({ lastWaybill, });

        const fieldsToChange = {
          ...this.getFieldsToChangeBasedOnLastWaybill(lastWaybillMod),
          plan_departure_date,
          odometr_start,
          motohours_start,
          motohours_equip_start,
          equipment_fuel,
          trailer_id,
        };
        this.props.handleMultipleChange(fieldsToChange);
      } else if (showInfo) {
        global.NOTIFICATION_SYSTEM.notify('Отсутствует информация о предыдущих закрытых путевых листах на указанное ТС', 'info', 'tr');
      }
    } catch (error) {
      return;
    }    
  };

  handleStructureIdChange = (structure_id) => {
    const {
      formState: { driver_id, car_id },
    } = this.props;
    const carData = this.props.carIndex[car_id];

    const changeObj: any = { structure_id };

    if (changeObj.structure_id) {
      changeObj.car_refill = [];
      changeObj.gas_refill = [];
      changeObj.fuel_given = 0;
      changeObj.gas_fuel_given = 0;
      changeObj.equipment_refill = [];
      changeObj.equipment_fuel_given = null;
    }
    if (
      carData
      && !(carData.is_common || carData.company_structure_id === structure_id)
    ) {
      changeObj.car_id = null;
      changeObj.driver_id = null;
    } else if (driver_id) {
      const driver = this.props.employeeIndex[driver_id];
      const DRIVERS = getDrivers(
        { ...this.props.formState, structure_id },
        this.props.employeeIndex,
        this.props.waybillDriverList,
      );

      if (!driver || !DRIVERS.some(({ value }) => value === driver_id)) {
        if (
          structure_id
          && !driver.is_common
          && driver.company_structure_id !== structure_id
        ) {
          changeObj.driver_id = null;
        }
      }
    }
    this.props.handleMultipleChange(changeObj);
  };

  checkOnValidHasEquipment() {
    const {
      formState: { equipment_fuel },
    } = this.props;

    if (!isBoolean(equipment_fuel)) {
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification(
          'Необходимо указать, установлено ли на ТС спецоборудование',
        ),
      );
      return false;
    }

    return true;
  }

  handleClose = (taxesControl) => {
    if (this.checkOnValidHasEquipment()) {
      return checkMissionSelectBeforeClose(
        this.props.formState,
        groupBy(
          [...this.state.missionsList, ...this.state.notAvailableMissions],
          'id',
        ),
        this.props.order_mission_source_id,
        (order_id) =>
          this.props.dispatch(actionLoadOrderById(order_id, this.props)),
      )
        .then(async () => {
          if (this.props.formState.status === 'active' || this.props.formState.status === 'deleted') {
            const { rejectMissionList } = this.state;
            await this.rejectMissionHandler(rejectMissionList).then((res) => {
              const { origMissionsList } = this.state;
              const {
                formState: { mission_id_list },
              } = this.props;
              const origMissionsIdList = origMissionsList.map((mis) => mis.id);
              // миссии, которые удалили из поля задание с бызовом rejectForm
              const rejectMissionIdList = rejectMissionList.map(
                (rejMission) => rejMission.payload.mission_id,
              );
              // задания, которые были удалены из формы без указания причины, т.к. они были отменены ранее
              const rejCanceled = origMissionsIdList.filter(
                (mission) =>
                  !this.props.formState.mission_id_list.includes(mission)
                  && !rejectMissionIdList.includes(mission),
              );
              // удаляем из старой mission_id_list миссии, которые удалось отменить
              const newMissionsList = origMissionsList.filter(
                // фильтруем исходные данные, исключаем оттуда миссии, которые были УСПЕШНО(200) отменены
                (mission) =>
                  !res.acceptedRejectMissionsIdList.includes(mission.number),
              );

              const newMission_id_list = origMissionsIdList
                .filter((origMis) => {
                  return !res.acceptedRejectMissionsIdList.includes(origMis);
                })
                .filter((origMis) => {
                  return !rejCanceled.includes(origMis);
                });

              this.props.handleMultipleChange({
                mission_id_list: [
                  ...new Set([...newMission_id_list, ...mission_id_list]),
                ],
              });
              this.setState({
                missionsList: newMissionsList,
              });
              if (!res.rejectMissionSubmitError) {
                this.props.handleClose(taxesControl);
              }
            }); // миссии, которые были успешно отменены, их удаляем из missionField
          } else {
            this.props.handleClose(taxesControl);
          }
        })
        .catch(() => {
          //
        });
    }

    return Promise.resolve(true);
  };
  handlePrint = async (...arg: Parameters<WaybillProps['handlePrint']>) => {
    if (this.checkOnValidHasEquipment()) {
      await this.refresh(true, false);
      this.props.handlePrint(...arg);
    }
  };
  handlePrintFromMiniButton = (...arg: Parameters<WaybillProps['handlePrintFromMiniButton']>) => {
    if (this.checkOnValidHasEquipment()) {
      this.props.handlePrintFromMiniButton(...arg);
    }
  };

  sortingDrivers = (a, b) => {
    if (a.isPrefer === b.isPrefer) {
      return defaultSortingFunction(a, b);
    }

    return b.isPrefer - a.isPrefer;
  };

  makeOptionsBySessionStructures = memoize((structures) =>
    structures.map(defaultSelectListMapper),
  );

  // очистка данных по топливу спецоборудования
  // возвращает true/false, да/нет в диалоговом окне
  clearFuelEquipmentData = async (
    changedFieldsData,                  // поля, которые ещё необходимо изменить
    withConfirmDialog,                  // показывать окно подтверждения очистки
    dialogBody?,                        // текст сообщения
    changeSelectorKey?,                 // ключ поля, из-за которого тригерится всплывашка
  ) => {
    // is_one_fuel_tank, equipment_fuel
    const fuelEquipmentChangeObj = {
      equipment_refill: [],
      equipment_fuel_given: null,
      equipment_fuel_type: null,
      equipment_fuel_to_give: null,
      equipment_fuel_start: null,
      equipment_fuel_end: null,
    };

    const changeObj = {
      ...fuelEquipmentChangeObj,
      ...changedFieldsData,
    };

    const equipmentCheckedKeyList = [
      // список полей, которые необходимо проверить на изменение
      'motohours_equip_start',
    ];

    // список полей, которые необходимо проверить на изменение
    const fuelEquipmentChekedKeyList = Object.keys(fuelEquipmentChangeObj);
    const fixedFloatKey = [
      // поля формата float, которые хранятся как строка "0.000"
      'equipment_fuel_end',
    ];

    let formWillChange = false; // проверяем изменяются ли значения в форме

    const formState = get(this, 'props.formState', null);

    if (formState) {
      const checkedList
        = changeSelectorKey === 'equipment_fuel' // поля, которые может поменять пользак
          ? [...equipmentCheckedKeyList, ...fuelEquipmentChekedKeyList]
          : changeSelectorKey === 'is_one_fuel_tank'
            ? [...fuelEquipmentChekedKeyList]
            : [];
      formWillChange = Object.keys(changeObj).some((key) => {
        let isEqualData = false;
        if (Array.isArray(formState[key])) {
          isEqualData = !formState[key].length;
        } else {
          if (fixedFloatKey.includes(key)) {
            isEqualData = formState[key]
              ? parseFloat(formState[key]) === 0
              : true;
          } else {
            isEqualData
              = formState[key] === changeObj[key]
              || formState[key] === ''
              || isNullOrUndefined(formState[key])
              || formState[key] === 0;
          }
        }
        return !isEqualData && checkedList.includes(key);
      });
    }

    if (withConfirmDialog && formWillChange) {
      try {
        await global.confirmDialog({
          title: 'Внимание',
          body: dialogBody || 'Очистить введенные данные по спецоборудованию?',
          okName: 'Да',
          cancelName: 'Нет',
        });
        this.handleMultipleChange(changeObj);
        return true;
      } catch (e) {
        console.error(e);  // eslint-disable-line
        return false;
      }
    } else {
      this.handleMultipleChange(changeObj);
      return true;
    }
  };

  handleIsOneFuelTank = async (is_one_fuel_tank) => {
    const {
      formState: { equipment_fuel, },
    } = this.props;
    const changeObj = {
      is_one_fuel_tank: Boolean(is_one_fuel_tank),
    };
    const lastWaybill = this.state?.lastWaybill;
    const clearEquipmentFuelData = !(lastWaybill && !isNullOrUndefined(lastWaybill['equipment_fuel_type']));
    const closedEquipmentData = getClosedEquipmentData(lastWaybill);
    let dialogIsConfirmed = false;

    if (changeObj.is_one_fuel_tank && clearEquipmentFuelData) {
      dialogIsConfirmed = await this.clearFuelEquipmentData(
        changeObj,
        true,
        'Очистить введенные данные по топливу спецоборудования?',
        'is_one_fuel_tank',
      );
    } else {
      this.handleMultipleChange({
        ...closedEquipmentData,
        ...changeObj,
        equipment_fuel,
      });
    }
    if (!dialogIsConfirmed && !changeObj.is_one_fuel_tank) {
      this.handleMultipleChange({...closedEquipmentData, ...changeObj, equipment_fuel});
    }
    return dialogIsConfirmed;
  };

  handleEquipmentFuel = (equipment_fuel, withConfirmDialog = false) => {
    if (equipment_fuel) {
      this.handleChangeHasEquipmentOnTrue(withConfirmDialog);
    } else {
      this.handleChangeHasEquipmentOnFalse(withConfirmDialog);
    }
  };

  handleChangeMotohoursOdometr = async (key, value) => {
    if(value){
      // берем значения из последнего закрытого ПЛ*
      const { lastWaybill } = this.state;

      if(lastWaybill) {
        const lastWaybillState = key === 'car_has_motohours'
          ? {
            ...this.state.lastWaybill,
            motohours_start: lastWaybill?.motohours_end,
            motohours_end: lastWaybill?.motohours_end, // возможно можно только это оставить?
            motohours_diff: lastWaybill?.motohours_diff,
          }
          : {
            ...this.state.lastWaybill,
            odometr_start: lastWaybill.odometr_end,
            odometr_end: lastWaybill.odometr_end, // возможно можно только это оставить?
            odometr_diff: lastWaybill.odometr_diff,
          };

        const fieldsToChange = {
          motohours_start: lastWaybillState.motohours_end,
          odometr_start: lastWaybillState.odometr_end,
        };
        this.setState({ lastWaybill: lastWaybillState, });

        this.handleMultipleChange(fieldsToChange);
      }

      this.handleChange(key, value);
    } else {
      try {
        // odometer --  odometr_start, odometr_end, odometr_diff
        // счетчика моточасов -- motohours_start, motohours_end, motohours_diff
        const {
          odometr_start,
          odometr_end,
          odometr_diff,
          motohours_start,
          motohours_end,
          motohours_diff,
        } = this.props.formState;

        const hasDialog = key === 'car_has_motohours'
          ? [motohours_start, motohours_end, motohours_diff].some((elem) => !isNullOrUndefined(elem))
          : [odometr_start, odometr_end, odometr_diff].some((elem) => !isNullOrUndefined(elem));

        if(hasDialog) {
          await global.confirmDialog({
            title: 'Внимание',
            body: key === 'car_has_motohours'
              ? 'Очистить введенные данные счетчика моточасов?'
              : 'Очистить введенные данные по одометру?',
            okName: 'Да',
            cancelName: 'Нет',
          });
        }

        this.handleMultipleChange( key === 'car_has_motohours'
          ? {
            motohours_start: null,
            motohours_end: null,
            motohours_diff: null,
            [key]: value,
          }
          : { // key === 'car_has_odometer'
            odometr_start: null,
            odometr_end: null,
            odometr_diff: null,
            [key]: value,
          });
      } catch (e) {
        console.error(e);  // eslint-disable-line
      }
    }
  };

  handleChangeHasEquipmentOnTrue = (withConfirmDialog) => {
    const { lastWaybill } = this.state;

    this.setState({ lastWaybill, });
    const closedEquipmentData = getClosedEquipmentData(lastWaybill);
    closedEquipmentData.equipment_fuel = true;
    closedEquipmentData.motohours_equip_start
      = lastWaybill
        ? lastWaybill.motohours_equip_end
        : null;
    this.clearFuelEquipmentData(closedEquipmentData, withConfirmDialog); // handleMultipleChange внутри этой функции,
  };

  handleChangeHasEquipmentOnFalse = async (withConfirmDialog = true) => {
    const { formState } = this.props;
    if (isNullOrUndefined(formState.equipment_fuel)) {
      this.handleChange('equipment_fuel', false);
    } else if (formState.equipment_fuel) {
      await this.clearFuelEquipmentData(
        {
          is_one_fuel_tank: true,
          motohours_equip_start: null,
          equipment_fuel: false,
          ...setEmptyFieldByKey(fieldToCheckHasData),
        },
        withConfirmDialog,
        false,
        'equipment_fuel',
      );
    }
  };

  handleChangeCarReFill = (car_refill) => {
    this.handleMultipleChange({
      car_refill,
      fuel_given: car_refill.reduce((summ, { value }) => summ + value, 0),
    });
  };

  handleChangeEquipmentRefill = (equipment_refill) => {
    this.handleMultipleChange({
      equipment_refill,
      equipment_fuel_given: equipment_refill.reduce(
        (summ, { value }) => summ + value,
        0,
      ),
    });
  };

  handleChangeGasReFill = (gas_refill) => {
    this.handleMultipleChange({
      gas_refill,
      gas_fuel_given: gas_refill.reduce((summ, { value }) => summ + value, 0),
    });
  };

  rejectMissionHandler = (rejectMissionList) => {
    let rejectMissionSubmitError = false;
    const acceptedRejectMissionsIdList = rejectMissionList.map(
      async (rejectMission) => {
        try {
          let response = null;

          if (
            rejectMission.handlerName
            === 'actionPostMissionReassignationParameters'
          ) {
            response = await this.props.dispatch(
              actionPostMissionReassignationParameters(rejectMission.payload, this.props),
            );
          } else if (
            rejectMission.handlerName
            === 'actionPutMissionReassignationParameters'
          ) {
            response = await this.props.dispatch(
              actionPutMissionReassignationParameters(rejectMission.payload, this.props),
            );
          } else if (rejectMission.handlerName === 'updateMission') {
            response = await this.props.dispatch(
              missionsActions.actionUpdateMission(
                rejectMission.payload,
                this.props,
              ),
            );

            if (response) {
              const { close_request, request_id, request_number } = response;

              if (close_request) {
                this.props.setEdcRequestIds([
                  {
                    request_id,
                    request_number,
                  },
                ]);
              }
            }
            return get(response, 'id', null);
          }
        } catch (errorData) {
          console.warn('rejectMissionHandler:', errorData);  // eslint-disable-line

          rejectMissionSubmitError = true;
          const missionId = get(rejectMission.payload, 'mission_id', '');

          if (!errorData.errorIsShow) {
            const errorText = get(
              errorData.error_text,
              'error_text',
              `Произошла ошибка, при попытке отмены задания №${missionId}`,
            );
            global.NOTIFICATION_SYSTEM.notify(
              getServerErrorNotification(
                `${errorText}`,
              ),
            );
          }
        }
        const mission_id = get(rejectMission, 'payload.mission_id', false);
        if (mission_id) {
          return mission_id;
        } else {
          return get(rejectMission, 'payload.id', null);
        }
      },
    );
    // чистим список с запросами на отмену заданий
    this.setState({
      rejectMissionList: [],
    });

    // rejectMissionHandler
    return Promise.all(acceptedRejectMissionsIdList).then((res) => {
      return {
        acceptedRejectMissionsIdList: res,
        rejectMissionSubmitError,
      };
    });
  };

  /**
   * Отправляем запросы на отмену, если один из запросов вернулся с ошибкой, то не отправляем запрос на сохранение ПЛ
   * При закрытии ПЛ, таже самая логика
   */

  handleSubmit = async () => {
    if (this.checkOnValidHasEquipment()) {
      if (this.props.formState.status === 'active' || this.props.formState.status === 'deleted') {
        const { rejectMissionList } = this.state;
        this.rejectMissionHandler(rejectMissionList).then((res) => {
          const { origMissionsList } = this.state;
          const { mission_id_list } = this.props.formState;
          const origMissionsIdList = origMissionsList.map((mis) => mis.id);

          // миссии, которые удалили из поля задание с бызовом rejectForm
          const rejectMissionIdList = rejectMissionList.map(
            (rejMission) => rejMission.payload.mission_id,
          );

          // задания, которые были удалены из формы без указания причины, т.к. они были отменены ранее
          const rejCanceled = origMissionsIdList.filter(
            (mission) =>
              !this.props.formState.mission_id_list.includes(mission)
              && !rejectMissionIdList.includes(mission),
          );

          // удаляем из старой mission_id_list миссии, которые удалось отменить
          const newMissionsList = origMissionsList.filter(
            // фильтруем исходные данные, исключаем оттуда миссии, которые были УСПЕШНО(200) отменены
            (mission) =>
              !res.acceptedRejectMissionsIdList.includes(mission.number),
          );

          const newMission_id_list = origMissionsIdList
            .filter((origMis) => {
              return !res.acceptedRejectMissionsIdList.includes(origMis);
            })
            .filter((origMis) => {
              return !rejCanceled.includes(origMis);
            });

          this.props.handleMultipleChange({
            mission_id_list: [
              ...new Set([...newMission_id_list, ...mission_id_list]),
            ],
          });
          this.setState({
            missionsList: newMissionsList,
          });
          this.props.onSubmitActiveWaybill(!res.rejectMissionSubmitError);
        }); // миссии, которые были успешно отменены, их удаляем из missionField
      } else {
        return this.props.onSubmit();
      }
    }
  };

  setRejectMissionList = (rejectMissionList) => {
    let { missionsList } = this.state;

    if (rejectMissionList) {
      // Удаляем из опций поля задание, миссии, которые в очереди на отмену, чо бы пользователь не смог их снова выбрать
      missionsList = missionsList.filter(
        (mission) =>
          !rejectMissionList.some(
            (rejMis) => rejMis.payload.id === mission.number,
          ),
      );
    }
    this.setState({
      rejectMissionList,
      missionsList,
    });
  };

  handleChangeTaxes = (taxes, field = 'taxes', index = null) => {
    this.handleChange(field, isArray(taxes) ? [...taxes] : taxes, index);
  };
  handleChangeEquipmentTaxes = (equipment_tax_data, field = 'equipment_tax_data', index = null) => {
    this.handleChange(
      field,
      isArray(equipment_tax_data)
        ? [...equipment_tax_data]
        : equipment_tax_data,
      index
    );
  };
  handleChangeGasTaxes = (gas_tax_data, field = 'gas_tax_data', index = null) => {
    this.handleChange(
      field,
      isArray(gas_tax_data)
        ? [...gas_tax_data]
        : gas_tax_data,
      index
    );
  };

  handleChangeActiveNavTab = (tabKey) => {
    this.setState({
      fuelActiveTabKey: tabKey,
    });
  };

  render() {
    const {
      loadingFields,
      origFormState = {},
      notAvailableMissions = [],
      missionsList = [],
      lastWaybill,
    } = this.state;

    const {
      formState: state,
      formErrors: errors,
      entity,
      carList,
      carIndex,
      waybillDriverList,
      employeeList = [],
      uniqEmployeesBindedOnCarList,
      appConfig,
      workModeList,
      employeeIndex,
      isPermittedByKey,
      userStructures,
      userStructureId,
      reasonListOptions,
      usePouring,
    } = this.props;

    const workModeOptions = workModeList.map(
      ({ id, name, start_time_text, end_time_text }) => ({
        value: id,
        label: `${name} (${start_time_text} - ${end_time_text})`,
        name,
      }),
    );

    let taxesControl = false;

    const getCarsByStructId = getCars(state.structure_id, state.car_id);
    const getTrailersByStructId = getTrailers(
      state.structure_id,
      state.trailer_id,
    );

    let CARS = getCarsByStructId(carList);

    if (state.car_id && !CARS.find((c) => c.value === state.car_id)) {
      CARS = [
        ...CARS,
        ...vehicleMapper([
          {
            asuods_id: state.car_id,
            model_id: state.car_model_id,
            model_name: state.car_model_name,
            gov_number: state.gov_number,
            special_model_name: state.car_special_model_name,
            type_name: state.car_type_name,
          },
        ]),
      ];
    }

    let TRAILERS = getTrailersByStructId(carList);

    if (
      state.trailer_id
      && !TRAILERS.find((c) => c.value === state.trailer_id)
    ) {
      TRAILERS = [
        ...TRAILERS,
        ...vehicleMapper([
          {
            asuods_id: state.trailer_id,
            model_id: state.trailer_model_id,
            model_name: state.trailer_model_name,
            gov_number: state.trailer_gov_number,
            special_model_name: state.trailer_special_model_name,
            type_name: state.trailer_type_name,
          },
        ]),
      ];
    }

    const FUEL_TYPES = map(appConfig.enums.FUEL_TYPE, (v, k) => ({
      value: k,
      label: v,
    }));

    const driversEnability = state.car_id !== null && state.car_id !== '';

    const STRUCTURES = this.makeOptionsBySessionStructures(userStructures);

    let STRUCTURE_FIELD_VIEW = false;
    let STRUCTURE_FIELD_READONLY = false;
    let STRUCTURE_FIELD_DELETABLE = false;
    if (
      userStructureId !== null
      && STRUCTURES.length === 1
      && userStructureId === STRUCTURES[0].value
    ) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_READONLY = true;
    } else if (
      userStructureId !== null
      && STRUCTURES.length > 1
      && find(STRUCTURES, (el) => el.value === userStructureId)
    ) {
      STRUCTURE_FIELD_VIEW = true;
    } else if (userStructureId === null && STRUCTURES.length > 1) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_DELETABLE = true;
    }

    const IS_CREATING = !state.status;
    const IS_ACTIVE = state?.status === 'active' || state?.status === 'deleted'; // Удален это признак, по факту статус ПЛ, активен
    const IS_DRAFT = state?.status === 'draft';
    const IS_CLOSED = state?.status === 'closed';
    const IS_DELETE = state?.status === 'deleted';

    const EMPLOYEES = employeeList.map(({ id, full_name, active, personnel_number, }) => {
      const personnel_number_txt = personnel_number
        ? `[${personnel_number}] `
        : '';
      return ({
        value: id,
        label: `${personnel_number_txt}${full_name}  ${!active && (IS_DRAFT || IS_CREATING) ? '(Не работает)' : ''}`,
      });
    });

    const IS_KAMAZ = (get(carIndex, `${state.car_id}.model_name`) || '')
      .toLowerCase()
      .includes('камаз');
    const CAR_HAS_ODOMETER = state.gov_number
      ? !hasMotohours(state.gov_number)
      : null;
    const DRIVERS
      = IS_CREATING || IS_DRAFT
        ? getDrivers(
          state,
          employeeIndex,
          uniqEmployeesBindedOnCarList[0]
            ? uniqEmployeesBindedOnCarList
            : waybillDriverList,
        )
        : [];

    const title = getTitleByStatus(state);
    const tax_data = get(state, 'tax_data', []) || [];
    const equipment_tax_data = get(state, 'equipment_tax_data', []) || [];
    const gas_tax_data = get(state, 'gas_tax_data', []) || [];

    if (this.state.fuelRates.length) {
      taxesControl = validateTaxesControl([...tax_data, ...gas_tax_data]);
    } else {
      taxesControl = true;
    }

    const allTaxes = [...tax_data, ...equipment_tax_data, ...gas_tax_data];
    const taxesTotal = allTaxes.reduce(
      (summ, { FUEL_RATE, FACT_VALUE }) => summ + FUEL_RATE * FACT_VALUE,
      0,
    );
    const taxeTotalHidden = allTaxes.length === 0;

    const employeeByIndex = get(
      this.props.employeeIndex,
      `${state.driver_id}`,
    );
    if (state.driver_id && !DRIVERS.some((d) => d.value === state.driver_id)) {
      const personnel_number = employeeByIndex?.personnel_number
        ? `[${employeeByIndex.personnel_number}] `
        : '';
      const isActiveText = (IS_DRAFT || IS_CREATING) && employeeByIndex?.active
        ? ''
        : '(Не работает)';
      DRIVERS.push({
        label: `${personnel_number}${employeeByIndex?.last_name
          || ''} ${employeeByIndex?.first_name || ''} ${employeeByIndex?.middle_name || ''} ${isActiveText}`,
        value: state.driver_id,
        rowData: { ...employeeByIndex}
      });
    }
    const gps_code = get(carIndex[state.car_id], 'gps_code');
    let distanceOrTrackOrNodata = state.distance;

    if (isNullOrUndefined(distanceOrTrackOrNodata)) {
      distanceOrTrackOrNodata = isNumber(parseInt(state.track_length, 10))
        ? state.track_length / 1000
        : 'Нет данных';
    } else {
      distanceOrTrackOrNodata = Number(distanceOrTrackOrNodata) / 1000;
    }

    const disableEquipmentFieldWaybillCarRefill
      = (IS_CLOSED && (!this.state.canEditIfClose || !isPermittedByKey.refill))
      || !isPermittedByKey.update || IS_DELETE;
    const disableFieldWaybillCarRefill
      = (IS_CLOSED && (!this.state.canEditIfClose || !isPermittedByKey.refill))
      || !isPermittedByKey.update || IS_DELETE;

    const disableComment = (
      IS_CLOSED && !isPermittedByKey.update_closed && !isPermittedByKey.update
    ) || (
      !IS_CLOSED && !isPermittedByKey.update
    );

    // <<< #ДаПростятМеняБоги, переписать в 33м!!!
    const driverNotActiveError = (IS_DRAFT || IS_CREATING) && state.driver_id && !employeeByIndex?.active
      ? 'Поле "Водитель" должно быть заполнено работающим сотрудником'
      : ''; // Если сотрудник неактивен, только для черновика
    
    const accompanyingPersonByIndex = get(
      this.props.employeeIndex,
      `${state.accompanying_person_id}`,
    );
    const accompanyingPersonNotActiveError = (IS_DRAFT || IS_CREATING) && state.accompanying_person_id && !accompanyingPersonByIndex?.active
      ? 'Поле "Сопровождающий" должно быть заполнено работающим сотрудником'
      : ''; // Если сотрудник неактивен, только для черновика
    
    const canWaybillPrint =  (IS_DRAFT || IS_CREATING)
      ? !driverNotActiveError.length
        && !accompanyingPersonNotActiveError.length
        && this.props.canSave
        && !this.state.missionHasError?.hasError
      : this.props.canSave && !this.state.missionHasError?.hasError;
    const canWaybillGiveOutRead =  (IS_DRAFT || IS_CREATING)
      ? !driverNotActiveError.length 
        && !accompanyingPersonNotActiveError.length
        && this.props.canSave
        && !this.state.missionHasError?.hasError
      : this.props.canSave && !this.state.missionHasError?.hasError;

    const odometrFiles = state.files? state.files.filter(({ kind }) => kind === 'odometr') : [];
    const odometrFilesError = errors.files?.odometr;
    const motohoursFiles = state.files ? state.files.filter(({ kind }) => kind === 'motohours') : [];
    const motohoursFilesError = errors.files?.motohours;
    const motohoursEquipFiles = state.files ? state.files.filter(({ kind }) => kind === 'motohours_equip') : [];
    const motohoursEquipFilesError = errors.files?.motohours_equip;
    
    return (
      <EtsBootstrap.ModalContainer
        id="modal-waybill"
        show={this.props.show}
        onHide={this.props.onHide}
        bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>
            {title} {IS_DRAFT && '(возможна корректировка)'}{' '}
            {(IS_CLOSED || IS_ACTIVE) && `№ ${state.number}`}
          </EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>

        <ModalBodyPreloader
          page={this.props.page}
          path={this.props.path}
          typePreloader="mainpage">
          <EtsBootstrap.Row>
            <Div>
              {IS_CLOSED || IS_ACTIVE ? (
                <EtsBootstrap.Col md={2}>
                  <ExtField
                    id="activated-by-employee-name"
                    type="string"
                    label="Выдан"
                    readOnly
                    hidden={!IS_CLOSED && !IS_ACTIVE}
                    value={state.activated_by_employee_name}
                  />
                  <ExtField
                    id="closed-by-employee-name"
                    type="string"
                    label="Закрыт"
                    readOnly
                    hidden={!IS_CLOSED}
                    value={state.closed_by_employee_name}
                  />
                </EtsBootstrap.Col>
              ) : (
                ''
              )}
              <EtsBootstrap.Col md={!IS_CLOSED && !IS_ACTIVE ? 6 : 4}>
                {STRUCTURE_FIELD_VIEW && (
                  <ExtField
                    id="waybill-structure-id"
                    type="select"
                    modalKey={modalKey}
                    label="Подразделение"
                    error={errors.structure_id}
                    disabled={
                      IS_DELETE
                      || STRUCTURE_FIELD_READONLY
                      || !(IS_CREATING || IS_DRAFT)
                      || !isPermittedByKey.update
                    }
                    clearable={STRUCTURE_FIELD_DELETABLE}
                    options={STRUCTURES}
                    emptyValue={null}
                    value={state.structure_id}
                    onChange={this.handleStructureIdChange}
                  />
                )}
                <ExtField
                  id="accompanying-person-id"
                  type="select"
                  modalKey={modalKey}
                  label="Сопровождающий"
                  error={errors.accompanying_person_id || accompanyingPersonNotActiveError}
                  clearable
                  disabled={IS_DELETE || IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update}
                  options={EMPLOYEES}
                  value={state.accompanying_person_id}
                  onChange={this.handleChange}
                  boundKeys="accompanying_person_id"
                />
              </EtsBootstrap.Col>
            </Div>
            <Div hidden={!(IS_CREATING || IS_DRAFT)}>
              <EtsBootstrap.Col md={3}>
                <ExtField
                  id="plan-departure-date"
                  type="date"
                  label="Выезд план."
                  error={errors.plan_departure_date}
                  date={state.plan_departure_date}
                  onChange={this.handlePlanDepartureDates}
                  boundKeys="plan_departure_date"
                  disabled={IS_DELETE || !isPermittedByKey.update}
                />
              </EtsBootstrap.Col>
            </Div>
            <Div hidden={!(IS_CREATING || IS_DRAFT)}>
              <EtsBootstrap.Col md={3}>
                <ExtField
                  id="plan-arrival-date"
                  type="date"
                  label="Возвращение план."
                  error={errors.plan_arrival_date}
                  date={state.plan_arrival_date}
                  min={state.plan_departure_date}
                  onChange={this.handlePlanDepartureDates}
                  boundKeys="plan_arrival_date"
                  disabled={ IS_DELETE || !isPermittedByKey.update}
                />
              </EtsBootstrap.Col>
            </Div>
            <EtsBootstrap.Col md={6}>
              <ExtField
                id="work_mode_id"
                type="select"
                label="Режим работы"
                error={errors.work_mode_id}
                clearable
                hidden={!(IS_CREATING || IS_DRAFT)}
                disabled={IS_DELETE || IS_ACTIVE || IS_CLOSED || !isPermittedByKey.update}
                options={workModeOptions}
                value={state.work_mode_id}
                onChange={this.handleChange}
                boundKeys="work_mode_id"
              />
            </EtsBootstrap.Col>
            <Div hidden={!(IS_ACTIVE || IS_CLOSED)}>
              <EtsBootstrap.Col md={3}>
                <ExtField
                  id="plan-departure-date"
                  type="date"
                  label="Выезд план."
                  error={errors.plan_departure_date}
                  date={state.plan_departure_date}
                  disabled
                />
                <ExtField
                  id="fact-departure-date"
                  type="date"
                  label="Выезд факт."
                  error={errors.fact_departure_date}
                  date={state.fact_departure_date}
                  disabled={
                    IS_DELETE || IS_CLOSED
                    || (!isPermittedByKey.update
                      && !isPermittedByKey.departure_and_arrival_values)
                  }
                  onChange={this.handleChange}
                  boundKeys="fact_departure_date"
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={3}>
                <ExtField
                  id="plan-arrival-date"
                  type="date"
                  label="Возвращение план."
                  error={errors.plan_arrival_date}
                  date={state.plan_arrival_date}
                  disabled
                />
                <ExtField
                  id="fact-arrival-date"
                  type="date"
                  label="Возвращение факт."
                  error={errors.fact_arrival_date}
                  date={state.fact_arrival_date}
                  disabled={
                    IS_DELETE || IS_CLOSED
                    || (!isPermittedByKey.update
                      && !isPermittedByKey.departure_and_arrival_values)
                  }
                  onChange={this.handleChange}
                  boundKeys="fact_arrival_date"
                />
              </EtsBootstrap.Col>
            </Div>
          </EtsBootstrap.Row>
          <br />
          <EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="car-id"
                    type="select"
                    modalKey={modalKey}
                    label="Транспортное средство (поиск по рег. и гаражному номеру ТС)"
                    error={errors.car_id}
                    className="white-space-pre-wrap"
                    hidden={!(IS_CREATING || IS_DRAFT)}
                    options={CARS}
                    value={state.car_id}
                    onChange={this.onCarChange}
                    disabled={IS_DELETE || !isPermittedByKey.update}
                  />

                  <ExtField
                    id="car-gov-number"
                    type="string"
                    label="Транспортное средство"
                    className="white-space-pre-wrap"
                    readOnly
                    hidden={IS_CREATING || IS_DRAFT}
                    value={`${state.gov_number} [${state.car_model_name || ''}${
                      state.car_model_name ? '/' : ''
                    }${state.car_special_model_name || ''}${
                      state.car_type_name ? '/' : ''
                    }${state.car_type_name || ''}]`}
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="trailer-id"
                    type="select"
                    modalKey={modalKey}
                    label="Прицеп"
                    error={errors.trailer_id}
                    className="white-space-pre-wrap"
                    hidden={!(IS_CREATING || IS_DRAFT)}
                    options={TRAILERS}
                    value={state.trailer_id}
                    onChange={this.handleChange}
                    boundKeys="trailer_id"
                    disabled={IS_DELETE || !isPermittedByKey.update}
                  />
                  <ExtField
                    id="trailer-gov-number"
                    type="string"
                    label="Прицеп"
                    className="white-space-pre-wrap"
                    readOnly
                    hidden={IS_CREATING || IS_DRAFT}
                    value={
                      state.trailer_id
                        ? `${
                          state.trailer_gov_number
                        } [${state.trailer_special_model_name || ''}${
                          state.trailer_special_model_name ? '/' : ''
                        }${state.trailer_model_name || ''}]`
                        : 'Н/Д'
                    }
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            
            <EtsBootstrap.Col md={6}>
              <WaybillEngineKind
                carIndex={carIndex}
                car_id={state.car_id}
                waybillStatus={{
                  IS_CREATING,
                  IS_ACTIVE,
                  IS_DRAFT,
                  IS_CLOSED,
                  IS_DELETE,
                }}
                engine_kind_ids={state.engine_kind_ids}
                handleChange={this.handleChange}
                handleMultipleChange={this.handleMultipleChange}
                setIsGasKind={this.setIsGasKind}
                origFormState={this.state.origFormState}
                waybillFormState={state}
              />
            </EtsBootstrap.Col>
            
            <EtsBootstrap.Col md={IS_ACTIVE || IS_CLOSED ? 3 : 6}>
              <BsnoStatus
                okStatus={IS_CREATING || IS_DRAFT}
                is_bnso_broken={state.is_bnso_broken}
                gps_code={gps_code}
                handleChange={this.handleChange}
                page={this.props.page}
                path={this.props.path}
              />
            </EtsBootstrap.Col>
            <Div hidden={!(IS_ACTIVE || IS_CLOSED)}>
              <EtsBootstrap.Col md={3}>
                <ExtField
                  id="distance-by-glonass"
                  type="number"
                  label="Пройдено по Глонасс, км"
                  error={errors.distance}
                  value={
                    this.state.tooLongFactDates
                      ? 'Слишком большой период действия ПЛ'
                      : distanceOrTrackOrNodata
                  }
                  isLoading={loadingFields.distance}
                  format="toFixed2"
                  disabled
                />
              </EtsBootstrap.Col>
            </Div>
            <EtsBootstrap.Col md={IS_CREATING || IS_DRAFT ? 12 : 4}>
              <ExtField
                id="driver-id"
                type="select"
                modalKey={modalKey}
                label="Водитель (возможен поиск по табельному номеру)"
                error={driversEnability ? errors.driver_id || driverNotActiveError : undefined}
                sortingFunction={this.sortingDrivers}
                hidden={!(IS_CREATING || IS_DRAFT)}
                readOnly={!driversEnability}
                options={DRIVERS}
                value={state.driver_id}
                onChange={this.handleChange}
                boundKeys="driver_id"
                disabled={IS_DELETE || !isPermittedByKey.update}
              />

              <ExtField
                id="driver-fio"
                type="string"
                label="Водитель"
                readOnly
                hidden={IS_CREATING || IS_DRAFT}
                value={employeeFIOLabelFunction(
                  employeeIndex,
                  state.driver_id,
                  true,
                )}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                id="work_mode_id"
                type="string"
                label="Режим работы"
                readOnly
                hidden={IS_CREATING || IS_DRAFT}
                value={state.work_mode_name}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          {Boolean(state.car_id) && (
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="equipment_fuel"
                  type="select"
                  label="На ТС установлено спецоборудование"
                  value={state.equipment_fuel}
                  options={YES_NO_SELECT_OPTIONS_BOOL}
                  onChange={this.handleEquipmentFuel}
                  disabled={ this.state.isGasKind || IS_DELETE || IS_CLOSED || !isPermittedByKey.update}
                  clearable={false}
                  modalKey={modalKey}
                  error={errors.equipment_fuel}
                />
              </EtsBootstrap.Col>
              {state.equipment_fuel && (
                <EtsBootstrap.Col md={4}>
                  <ExtField
                    id="is_one_fuel_tank"
                    type="select"
                    label="Таксировка с одного топливного бака"
                    value={state.is_one_fuel_tank}
                    options={YES_NO_SELECT_OPTIONS_BOOL}
                    onChange={this.handleIsOneFuelTank}
                    disabled={IS_DELETE || IS_CLOSED || !isPermittedByKey.update}
                    clearable={false}
                    modalKey={modalKey}
                  />
                </EtsBootstrap.Col>
              )}
              {CAR_HAS_ODOMETER && (
                <EtsBootstrap.Col md={4}>
                  <ExtField
                    id="car_has_motohours"
                    type="select"
                    label="На ТС установлен счетчик моточасов"
                    value={state.car_has_motohours}
                    options={YES_NO_SELECT_OPTIONS_BOOL}
                    onChange={this.handleChangeMotohoursOdometr}
                    disabled={IS_DELETE || IS_CLOSED || !isPermittedByKey.update}
                    clearable={false}
                    modalKey={modalKey}
                    boundKeys="car_has_motohours"
                    error={errors.car_has_motohours}
                  />
                </EtsBootstrap.Col>
              )}
              {!CAR_HAS_ODOMETER && (
                <EtsBootstrap.Col md={4}>
                  <ExtField
                    id="car_has_odometr"
                    type="select"
                    label="На ТС установлен одометр"
                    value={state.car_has_odometr}
                    options={YES_NO_SELECT_OPTIONS_BOOL}
                    onChange={this.handleChangeMotohoursOdometr}
                    disabled={IS_DELETE || IS_CLOSED || !isPermittedByKey.update}
                    clearable={false}
                    modalKey={modalKey}
                    boundKeys="car_has_odometr"
                    error={errors.car_has_odometr}
                  />
                </EtsBootstrap.Col>
              )}
              {Boolean(state.equipment_fuel && !state.is_one_fuel_tank) && (
                <EtsBootstrap.Col md={4}>
                  <ExtField
                    type="number"
                    label="Общее топливо при выезде, л"
                    value={
                      Number(state.equipment_fuel_start)
                      + Number(state.fuel_start)
                      + Number(state.gas_fuel_start)
                    }
                    format="toFixed3"
                    disabled
                  />
                </EtsBootstrap.Col>
              )}
            </EtsBootstrap.Row>
          )}
          {/*  */}
          <Div hidden={!Boolean(IS_ACTIVE || IS_CLOSED || IS_DELETE)}>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <h3 style={{ marginBottom: '20px' }} >Данные по ДУТ</h3>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <BorderDash
                  width={1}
                  borderStyle="solid"
                  color={UiConstants.colorGrey}>
                  <EtsBootstrap.Row>
                    <EtsBootstrap.Col md={12}>
                      <h4></h4>
                    </EtsBootstrap.Col>
                    <EtsBootstrap.Col md={12}>
                      <EtsBootstrap.Col md={4}>
                        <ExtField
                          id="sensor_start_value"
                          type="number"
                          label="Выезд по ДУТ, л "
                          error={errors.sensor_start_value}
                          value={state.sensor_start_value}
                          isLoading={loadingFields.sensor_start_value}
                          format="toFixed3"
                          disabled
                        />
                      </EtsBootstrap.Col>
                      <EtsBootstrap.Col md={4}>
                        <ExtField
                          id="sensor_refill"
                          type="number"
                          label="Заправка по ДУТ, л"
                          error={errors.sensor_refill}
                          value={state.sensor_refill}
                          isLoading={loadingFields.sensor_refill}
                          format="toFixed3"
                          disabled
                        />
                      </EtsBootstrap.Col>
                    </EtsBootstrap.Col>
                  </EtsBootstrap.Row>
                  <EtsBootstrap.Row>
                    <EtsBootstrap.Col md={12}>
                      <EtsBootstrap.Col md={4}>
                        <ExtField
                          id="consumption"
                          type="number"
                          label="Расход по ДУТ, л"
                          error={errors.consumption}
                          value={state.consumption || state.sensor_consumption}
                          isLoading={loadingFields.consumption}
                          format="toFixed3"
                          disabled
                        />
                      </EtsBootstrap.Col>
                      <EtsBootstrap.Col md={4}>
                        <ExtField
                          id="sensor_finish_value"
                          type="number"
                          label="Возврат по ДУТ, л"
                          error={errors.sensor_finish_value}
                          value={state.sensor_finish_value}
                          isLoading={loadingFields.sensor_finish_value}
                          format="toFixed3"
                          disabled
                        />
                      </EtsBootstrap.Col>
                    </EtsBootstrap.Col>
                  </EtsBootstrap.Row>
                </BorderDash>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </Div>
          <Div hidden={!state.car_id}>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <h3 style={{ marginBottom: '20px' }} >Транспортное средство</h3>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <BorderDash
                  width={1}
                  borderStyle="solid"
                  color={UiConstants.colorGrey}>
                  <EtsBootstrap.Row>
                    <EtsBootstrap.Col md={12}>
                      <EtsBootstrap.Row>
                        <EtsBootstrap.Col md={12}>
                          { Boolean(CAR_HAS_ODOMETER || state.car_has_odometr)
                          && <EtsBootstrap.Col md={4}>
                            <h4>Одометр</h4>
                            <FlexContainerStyled alignItems="flex-end">
                              <ExtField
                                id="odometr-start"
                                type="number"
                                label="Выезд из гаража, км"
                                error={errors.odometr_start}
                                value={state.odometr_start}
                                disabled={
                                  IS_DELETE || (IS_ACTIVE && isNullOrUndefined(state.fuel_type) && isNullOrUndefined(state.gas_fuel_type)) || IS_CLOSED || !isPermittedByKey.update
                                      || !state.is_edited_odometr && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['odometr_end']))
                                }
                                onChange={this.handleChange}
                                boundKeys="odometr_start"
                                showBtn={(IS_ACTIVE || IS_DRAFT || isPermittedByKey.update) && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['odometr_end']))}
                                btnProps={{
                                  disabled: IS_DELETE || IS_CLOSED || !isPermittedByKey.update,
                                  onClick: this.handleChangeOdometr,
                                  title: !state.is_edited_odometr ? 'Открыть ручной ввод' : 'Закрыть ручной ввод',
                                  glyph: !state.is_edited_odometr ? 'pencil' : 'lock',
                                  style: { marginBottom: '10px', minHeight: '38px'}, }} // <<< выпилить этот костыль в 36м релизе!!!
                              />
                            </FlexContainerStyled>
                            <ExtField
                              id="odometr-end"
                              type="number"
                              label="Возвращение в гараж, км"
                              error={errors.odometr_end}
                              value={state.odometr_end}
                              hidden={!(IS_ACTIVE || IS_CLOSED)}
                              disabled={
                                IS_DELETE || (IS_CLOSED && !this.state.canEditIfClose)
                                || (!isPermittedByKey.update
                                  && !isPermittedByKey.departure_and_arrival_values)
                              }
                              onChange={this.handleChange}
                              boundKeys="odometr_end"
                            />
                            <ExtField
                              id="odometr-diff"
                              type="number"
                              label="Пробег, км"
                              value={state.odometr_diff}
                              hidden={!(IS_ACTIVE || IS_CLOSED)}
                              disabled
                            />
                          </EtsBootstrap.Col>
                          }
                          { Boolean(state.is_edited_odometr)
                          && <EtsBootstrap.Col md={4}>
                            <h4>Изменение показателя выезда</h4>
                            <ExtField
                              id="odometr_reason_id"
                              type="select"
                              label="Причина"
                              disabled={
                                IS_DELETE || (IS_ACTIVE && isNullOrUndefined(state.fuel_type) && isNullOrUndefined(state.gas_fuel_type)) || IS_CLOSED || !isPermittedByKey.update
                                || !state.is_edited_odometr && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['odometr_end']))
                              }
                              options={reasonListOptions}
                              value={state.odometr_reason_id}
                              error={errors.odometr_reason_id}
                              clearable={false}
                              onChange={this.handleChange}
                              boundKeys="odometr_reason_id"
                            />
                            <FileField
                              multiple
                              label="Файл"
                              type="file"
                              kind="odometr"
                              disabled={
                                IS_DELETE || (IS_ACTIVE && isNullOrUndefined(state.fuel_type) && isNullOrUndefined(state.gas_fuel_type) ) || IS_CLOSED || !isPermittedByKey.update
                                || !state.is_edited_odometr && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['odometr_end']))
                              }
                              value={odometrFiles}
                              error={odometrFilesError}
                              onChange={this.handleFileChange}
                              boundKeys="odometr"
                            />
                          </EtsBootstrap.Col>
                          }
                          { Boolean(!CAR_HAS_ODOMETER || state.car_has_motohours)
                          && <EtsBootstrap.Col md={4}>
                            <h4>Счетчик моточасов</h4>
                            <FlexContainerStyled alignItems="flex-end">
                              <ExtField
                                id="motohours-start"
                                type="number"
                                label="Выезд из гаража, м/ч"
                                error={errors.motohours_start}
                                value={state.motohours_start}
                                disabled={
                                  IS_DELETE || (IS_ACTIVE && isNullOrUndefined(state.fuel_type) && isNullOrUndefined(state.gas_fuel_type)) || IS_CLOSED || !isPermittedByKey.update
                                || !state.is_edited_motohours && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['motohours_end']))
                                }
                                onChange={this.handleChange}
                                boundKeys="motohours_start"
                                showBtn={(IS_ACTIVE || IS_DRAFT || isPermittedByKey.update) && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['motohours_end']))}
                                btnProps={{
                                  disabled: IS_DELETE || IS_CLOSED || !isPermittedByKey.update,
                                  onClick: this.handleChangeMotohours,
                                  title: !state.is_edited_motohours ? 'Открыть ручной ввод' : 'Закрыть ручной ввод',
                                  glyph: !state.is_edited_motohours ? 'pencil' : 'lock',
                                  style: { marginBottom: '10px', minHeight: '38px'},}}
                              />
                            </FlexContainerStyled>
                            <ExtField
                              id="motohours-end"
                              type="number"
                              label="Возвращение в гараж, м/ч"
                              error={errors.motohours_end}
                              value={state.motohours_end}
                              hidden={!(IS_ACTIVE || IS_CLOSED)}
                              disabled={
                                IS_DELETE || (IS_CLOSED && !this.state.canEditIfClose)
                                || (!isPermittedByKey.update
                                  && !isPermittedByKey.departure_and_arrival_values)
                              }
                              onChange={this.handleChange}
                              boundKeys="motohours_end"
                            />

                            <ExtField
                              id="motohours_diff"
                              type="number"
                              label="Пробег, м/ч"
                              value={state.motohours_diff}
                              hidden={!(IS_ACTIVE || IS_CLOSED)}
                              disabled
                            />
                          </EtsBootstrap.Col>
                          }
                          { Boolean((!CAR_HAS_ODOMETER || state.car_has_motohours) && state.is_edited_motohours)
                          && <EtsBootstrap.Col md={4}>
                            <h4>Изменение показателя выезда</h4>
                            <ExtField
                              id="motohours_reason_id"
                              type="select"
                              label="Причина"
                              options={reasonListOptions}
                              value={state.motohours_reason_id}
                              error={errors.motohours_reason_id}
                              disabled={
                                IS_DELETE || (IS_ACTIVE && isNullOrUndefined(state.fuel_type) && isNullOrUndefined(state.gas_fuel_type)) || IS_CLOSED || !isPermittedByKey.update
                                || !state.is_edited_motohours && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['motohours_end']))
                              }
                              clearable={false}
                              onChange={this.handleChange}
                              boundKeys="motohours_reason_id"
                            />
                            <FileField
                              multiple
                              label="Файл"
                              type="file"
                              kind="motohours"
                              disabled={
                                IS_DELETE || (IS_ACTIVE && isNullOrUndefined(state.fuel_type) && isNullOrUndefined(state.gas_fuel_type)) || IS_CLOSED || !isPermittedByKey.update
                                || !state.is_edited_motohours && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['motohours_end']))
                              }
                              value={motohoursFiles}
                              error={motohoursFilesError}
                              onChange={this.handleFileChange}
                              boundKeys="motohours"
                            />
                          </EtsBootstrap.Col>
                          }
                        </EtsBootstrap.Col>
                      </EtsBootstrap.Row>
                    </EtsBootstrap.Col>

                    <EtsBootstrap.Col md={12}>
                      <EtsBootstrap.Col md={12}>
                        <FuelNavHeader
                          isPermitted={true}
                          activeTabKey={this.state.fuelActiveTabKey}
                          handleTabChange={this.handleChangeActiveNavTab}
                          errors={errors}
                          isGasKind={this.state.isGasKind}
                          isFuelKind={this.state.isFuelKind}
                          isElectricityKind={this.state.isElectricityKind}
                        />
                      </EtsBootstrap.Col>
                    </EtsBootstrap.Col>
                    <EtsBootstrap.Col md={12}>
                      {/* <-- start  Tab Топливо */}
                      <FuelBodyContainer
                        modalKey={modalKey}
                        waybillState={this.state}
                        waybillFormState={state}
                        use_pouring={usePouring}
                        errors={errors}
                        waybillStatus={{
                          IS_CREATING,
                          IS_ACTIVE,
                          IS_DRAFT,
                          IS_CLOSED,
                          IS_DELETE,
                        }}
                        handleMultipleChange={this.handleMultipleChange}
                        isPermittedByKey={isPermittedByKey}
                        lastWaybill={lastWaybill}
                        origFormState={origFormState}
                        handleChange={this.handleChange}
                        handleChangeCarReFill={this.handleChangeCarReFill}
                        page={this.props.page}
                        path={this.props.path}
                        CAR_HAS_ODOMETER={CAR_HAS_ODOMETER}
                        setTotalValueError={this.props.setTotalValueError}
                        fuelCardsList={this.props.fuelCardsList}
                        tax_data={tax_data}
                        gas_tax_data={gas_tax_data}
                        FUEL_TYPES={FUEL_TYPES}
                        IS_KAMAZ={IS_KAMAZ}
                        disableFieldWaybillCarRefill={disableFieldWaybillCarRefill}
                        handleChangeTaxes={this.handleChangeTaxes}
                        showComponent={this.state.fuelActiveTabKey === 'fuel'}
                      />
                      {/* <-- end  Tab Топливо */}
                      {/* <-- start  Tab gas */}
                      {
                        <GasBodyContainer
                          modalKey={modalKey}
                          waybillState={this.state}
                          waybillFormState={state}
                          use_pouring={usePouring && !this.state.isGasKind}
                          errors={errors}
                          waybillStatus={{
                            IS_CREATING,
                            IS_ACTIVE,
                            IS_DRAFT,
                            IS_CLOSED,
                            IS_DELETE,
                          }}
                          handleMultipleChange={this.handleMultipleChange}
                          isPermittedByKey={isPermittedByKey}
                          lastWaybill={lastWaybill}
                          origFormState={origFormState}
                          handleChange={this.handleChange}
                          handleChangeGasReFill={this.handleChangeGasReFill}
                          page={this.props.page}
                          path={this.props.path}
                          CAR_HAS_ODOMETER={CAR_HAS_ODOMETER}
                          setTotalValueError={this.props.setTotalValueError}
                          gasFuelCardsList={this.props.gasFuelCardsList}
                          gas_tax_data={gas_tax_data}
                          tax_data={tax_data}
                          FUEL_TYPES={FUEL_TYPES}
                          IS_KAMAZ={IS_KAMAZ}
                          disableFieldWaybillCarRefill={disableFieldWaybillCarRefill}
                          handleChangeTaxes={this.handleChangeGasTaxes}
                          isGasKind={this.state.isGasKind}
                          isFuelKind={this.state.isFuelKind}
                          isElectricityKind={this.state.isElectricityKind}
                          showComponent={this.state.fuelActiveTabKey === 'gas'}
                          handleEquipmentFuel={this.handleEquipmentFuel}
                        />
                      }
                      {/* <-- end  Tab gas */}
                      {/* <-- start  Tab electricity */}
                      {
                        this.state.fuelActiveTabKey === 'electricity'
                          && <TabBodyContainerStyled>
                            <EtsBootstrap.Col md={12}>
                              <h3>Блок 'Электроэнергия' в разработке</h3>
                            </EtsBootstrap.Col>
                          </TabBodyContainerStyled>
                      }
                      {/* <-- end  Tab electricity */}
                    </EtsBootstrap.Col>
                  </EtsBootstrap.Row>

                </BorderDash>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            {state.equipment_fuel && (
              <React.Fragment>
                <EtsBootstrap.Row>
                  <EtsBootstrap.Col md={12}>
                    <h3>Спецоборудование</h3>
                  </EtsBootstrap.Col>
                </EtsBootstrap.Row>
                <EtsBootstrap.Row>
                  <EtsBootstrap.Col md={12}>
                    <BorderDash
                      width={1}
                      borderStyle="solid"
                      color={UiConstants.colorGrey}>
                      <EtsBootstrap.Row>
                        <EtsBootstrap.Col md={12}>
                          <EtsBootstrap.Col md={4}>
                            <h4>Счетчик моточасов оборудования</h4>
                            <FlexContainerStyled alignItems="flex-end">
                              <ExtField
                                id="motohours-equip-start"
                                type="number"
                                label="Выезд из гаража, м/ч"
                                error={errors.motohours_equip_start}
                                value={state.motohours_equip_start}
                                disabled={
                                  IS_DELETE || IS_CLOSED || !isPermittedByKey.update
                                  || !state.is_edited_motohours_equip && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['motohours_equip_end']))
                                }
                                onChange={this.handleChange}
                                boundKeys="motohours_equip_start"
                                showBtn={(IS_ACTIVE || IS_DRAFT || isPermittedByKey.update) && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['motohours_equip_end']))}
                                btnProps={{
                                  disabled: IS_DELETE || IS_CLOSED || !isPermittedByKey.update,
                                  onClick: this.handleChangeEquip,
                                  title: !state.is_edited_motohours_equip ? 'Открыть ручной ввод' : 'Закрыть ручной ввод',
                                  glyph: !state.is_edited_motohours_equip ? 'pencil' : 'lock',
                                  style: { marginBottom: '10px', minHeight: '38px'}, }}
                              />
                            </FlexContainerStyled>
                            <ExtField
                              id="motohours-equip-end"
                              type="number"
                              label="Возвращение в гараж, м/ч"
                              error={errors.motohours_equip_end}
                              value={state.motohours_equip_end}
                              hidden={ !(IS_ACTIVE || IS_CLOSED) }
                              disabled={(IS_DELETE || IS_CLOSED && !this.state.canEditIfClose)
                                || (!isPermittedByKey.update && !isPermittedByKey.departure_and_arrival_values)}
                              onChange={this.handleChange}
                              boundKeys="motohours_equip_end"
                            />
                            <ExtField
                              id="motohours-equip-diff"
                              type="number"
                              label="Пробег, м/ч"
                              value={state.motohours_equip_diff}
                              hidden={!(IS_ACTIVE || IS_CLOSED)}
                              disabled
                            />
                          </EtsBootstrap.Col>
                          { Boolean(state.is_edited_motohours_equip)
                          && <EtsBootstrap.Col md={4}>
                            <h4>Изменение показателя выезда</h4>
                            <ExtField
                              id="motohours_equip_reason_id"
                              type="select"
                              label="Причина"
                              options={reasonListOptions}
                              value={state.motohours_equip_reason_id}
                              error={errors.motohours_equip_reason_id}
                              disabled={
                                IS_DELETE || IS_CLOSED || !isPermittedByKey.update
                                || !state.is_edited_motohours_equip && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['motohours_equip_end']))
                              }
                              clearable={false}
                              onChange={this.handleChange}
                              boundKeys="motohours_equip_reason_id"
                            />
                            <FileField
                              multiple
                              label="Файл"
                              type="file"
                              kind="motohours_equip"
                              disabled={
                                IS_DELETE || IS_CLOSED || !isPermittedByKey.update
                                || !state.is_edited_motohours_equip && Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['motohours_equip_end']))
                              }
                              value={motohoursEquipFiles}
                              error={motohoursEquipFilesError}
                              onChange={this.handleFileChange}
                              boundKeys="motohours_equip"
                            />
                          </EtsBootstrap.Col>
                          }
                          {!state.is_one_fuel_tank && (
                            <EtsBootstrap.Col md={8}>
                              <EtsBootstrap.Row>
                                <EtsBootstrap.Col md={12}>
                                  <h4> Топливо для оборудования</h4>
                                </EtsBootstrap.Col>
                              </EtsBootstrap.Row>
                              <EtsBootstrap.Row>
                                <EtsBootstrap.Col md={4}>
                                  <FuelType
                                    modalKey={modalKey}
                                    keyField="equipment_fuel_type"
                                    value={state.equipment_fuel_type}
                                    error={errors.equipment_fuel_type}
                                    disabled={
                                      IS_DELETE || IS_CLOSED || !isPermittedByKey.update
                                      || Boolean(lastWaybill && !lastWaybill['is_one_fuel_tank'] && !isNullOrUndefined(lastWaybill['equipment_fuel_type']))
                                    }
                                    options={FUEL_TYPES}
                                    handleChange={
                                      this.props.handleMultipleChange
                                    }
                                  />
                                </EtsBootstrap.Col>
                                <EtsBootstrap.Col md={4}>
                                  {!(IS_DRAFT || IS_CREATING) && (
                                    <ExtField
                                      id="equipment-fuel-end"
                                      type="number"
                                      label="Возврат по таксировке, л"
                                      value={state.equipment_fuel_end}
                                      format="toFixed3"
                                      disabled
                                    />
                                  )}
                                </EtsBootstrap.Col>
                                <EtsBootstrap.Col md={4}>
                                  <ExtField
                                    id="equipment-tax-consumption"
                                    type="number"
                                    label="Расход по таксировке, л"
                                    value={state.equipment_tax_consumption}
                                    format="toFixed3"
                                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                                    disabled
                                  />
                                </EtsBootstrap.Col>
                              </EtsBootstrap.Row>
                              <EtsBootstrap.Row>
                                <EtsBootstrap.Col md={4}>
                                  <ExtField
                                    id="equipment-fuel-start"
                                    type="number"
                                    label="Выезд, л"
                                    error={errors.equipment_fuel_start}
                                    value={state.equipment_fuel_start}
                                    disabled={
                                      IS_DELETE || IS_CLOSED || !isPermittedByKey.update
                                      || Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['equipment_fact_fuel_end']))
                                    }
                                    onChange={this.handleChange}
                                    boundKeys="equipment_fuel_start"
                                    format="toFixed3"
                                  />
                                </EtsBootstrap.Col>
                                <EtsBootstrap.Col md={4}>
                                  <ExtField
                                    id="equipment-fact-fuel-end"
                                    type="number"
                                    modalKey={modalKey}
                                    label="Возврат фактический, л"
                                    error={errors.equipment_fact_fuel_end}
                                    value={state.equipment_fact_fuel_end}
                                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                                    disabled={
                                      IS_DELETE
                                      || !(
                                        IS_ACTIVE || this.state.canEditIfClose
                                      ) || !isPermittedByKey.update
                                    }
                                    onChange={this.handleChange}
                                    boundKeys="equipment_fact_fuel_end"
                                    format="toFixed3"
                                  />
                                </EtsBootstrap.Col>
                                <EtsBootstrap.Col md={4}>
                                  <ExtField
                                    id="equipment-fact-consuption"
                                    type="number"
                                    modalKey={modalKey}
                                    label="Расход фактический, л"
                                    error={errors.equipment_fact_consumption}
                                    value={state.equipment_fact_consumption}
                                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                                    disabled
                                    onChange={this.handleChange}
                                    boundKeys="equipment_fact_consumption"
                                    format="toFixed3"
                                  />
                                </EtsBootstrap.Col>
                              </EtsBootstrap.Row>
                              <EtsBootstrap.Row>
                                <EtsBootstrap.Col md={4}>
                                  <ExtField
                                    id="equipment-fuel-given"
                                    type="number"
                                    label="Выдано, л"
                                    value={state.equipment_fuel_given}
                                    error={errors.equipment_fuel_given}
                                    disabled
                                  />
                                </EtsBootstrap.Col>
                                <EtsBootstrap.Col md={4}>
                                  {Boolean(IS_ACTIVE || IS_CLOSED)
                                    && <InfoBlock>
                                      Значение поля «Возврат фактический, л» обновляется при редактировании таксировки.
                                    </InfoBlock> }
                                </EtsBootstrap.Col>
                                <EtsBootstrap.Col md={4}>
                                  <ExtField
                                    id="equipment-consuption-diff"
                                    type="number"
                                    modalKey={modalKey}
                                    label="Расхождение в данных расхода, л"
                                    error={errors.equipment_diff_consumption}
                                    value={state.equipment_diff_consumption}
                                    hidden={!(IS_ACTIVE || IS_CLOSED)}
                                    disabled
                                    onChange={this.handleChange}
                                    boundKeys="equipment_diff_consumption"
                                    format="toFixed3"
                                  />
                                </EtsBootstrap.Col>
                              </EtsBootstrap.Row>
                            </EtsBootstrap.Col>
                          )}
                        </EtsBootstrap.Col>
                        <EtsBootstrap.Col md={12} zIndex={2}>
                          <EtsBootstrap.Col md={12}>
                            <FieldWaybillCarRefill
                              id="equipment_refill"
                              array={state.equipment_refill}
                              arrayOrigin={origFormState.equipment_refill}
                              errors={get(
                                errors,
                                'equipment_refill',
                                state.equipment_refill.map(() => ({})),
                              )} // временно
                              title="Заправка топлива"
                              handleChange={this.handleChangeEquipmentRefill}
                              use_pouring={usePouring}
                              fuel_given={state.equipment_fuel_given}
                              structure_id={state.structure_id}
                              fuel_type={state.equipment_fuel_type}
                              car_id={state.car_id}
                              date_for_valid={{
                                fact_departure_date: state.fact_departure_date,
                                plan_departure_date: state.plan_departure_date,
                                plan_arrival_date: state.plan_arrival_date,
                                fact_arrival_date: state.fact_arrival_date,
                              }}
                              IS_DRAFT_OR_ACTIVE={
                                IS_CREATING || IS_DRAFT || IS_ACTIVE
                              }
                              disabled={disableEquipmentFieldWaybillCarRefill}
                              page={this.props.page}
                              path={this.props.path}
                              canEditIfClose={this.state.canEditIfClose}
                              is_one_fuel_tank={state.is_one_fuel_tank}
                              boundKey={'equipment_refill'}
                              fuelCardsList={this.props.equipmentFuelCardsList}
                            />
                          </EtsBootstrap.Col>
                        </EtsBootstrap.Col>
                        <EtsBootstrap.Col md={12} zIndex={1}>
                          <EtsBootstrap.Col md={12}>
                            <EquipmentTaxes
                              modalKey={modalKey}
                              hidden={
                                !(IS_CLOSED || IS_ACTIVE)
                                || IS_DRAFT
                                || (IS_CLOSED
                                  && state.equipment_tax_data
                                  && state.equipment_tax_data.length === 0
                                  && !this.state.canEditIfClose)
                                || (IS_CLOSED && !state.equipment_tax_data && !this.state.canEditIfClose)
                              }
                              readOnly={
                                IS_DELETE || (!IS_ACTIVE && !this.state.canEditIfClose) || !isPermittedByKey.update
                              }
                              IS_CLOSED={IS_CLOSED}
                              taxes={equipment_tax_data}
                              operations={this.state.equipmentOperations}
                              fuelRates={this.state.equipmentFuelRates}
                              title="Расчет топлива по норме для оборудования"
                              noDataMessage="Для данного ТС нормы расхода топлива для спецоборудования не указаны."
                              onChange={this.handleChangeEquipmentTaxes}
                              baseFactValue={state.motohours_equip_diff}
                              type="motohours"
                              errorsAll={errors}
                              setTotalValueError={this.props.setTotalValueError}
                            />
                            <ErrorsBlock error={errors.equipment_tax_data} />
                          </EtsBootstrap.Col>
                        </EtsBootstrap.Col>
                      </EtsBootstrap.Row>
                    </BorderDash>
                  </EtsBootstrap.Col>
                </EtsBootstrap.Row>
              </React.Fragment>
            )}
          </Div>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={8}>
              <MissionField
                carList={this.props.carList}
                state={state}
                errors={errors}
                missionsList={missionsList}
                notAvailableMissions={notAvailableMissions}
                IS_CLOSED={IS_CLOSED}
                IS_DELETE={IS_DELETE}
                IS_DRAFT={IS_DRAFT}
                IS_CREATING={IS_CREATING}
                IS_ACTIVE={IS_ACTIVE}
                isPermittedByKey={isPermittedByKey}
                origFormState={origFormState}
                handleChange={this.handleChange}
                getMissionsByCarAndDates={this.getMissionsByCarAndDates}
                rejectMissionList={this.state.rejectMissionList}
                setRejectMissionList={this.setRejectMissionList}
                moscowTimeServer={this.props.moscowTimeServer}
                setMissionHasError={this.setMissionHasError}
                page={this.props.page}
                path={this.props.path}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4} style={{marginTop: '14px',}}>
              <ExtField
                type="number"
                label="Общий расход топлива, л"
                value={taxesTotal}
                hidden={taxeTotalHidden}
                format="toFixed3"
                disabled
              />
            </EtsBootstrap.Col>
            <Div hidden={!(IS_ACTIVE || IS_CLOSED)}>
              <EtsBootstrap.Col md={8}>
                <ExtField
                  id="waybill-comment"
                  type="text"
                  label="Комментарий"
                  disabled={disableComment}
                  value={state.comment}
                  onChange={this.handleChange}
                  boundKeys="comment"
                  error={errors.comment}
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="failed-medical-stat-types"
                  type="string"
                  label="Непройденные мед. осмотры"
                  disabled
                  value={state.failed_medical_stat_types}
                  onChange={this.handleChange}
                  boundKeys="failed_medical_stat_types"
                  error={errors.failed_medical_stat_types}
                />
              </EtsBootstrap.Col>
            </Div>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <h4>Простои на линии, ч.</h4>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={8}>
                  <EtsBootstrap.Row>
                    <EtsBootstrap.Col md={6}>
                      <ExtField
                        id="downtime-hours-work"
                        type="number"
                        label="Работа"
                        disabled={
                          IS_DELETE || (IS_CLOSED && !this.state.canEditIfClose)
                          || !isPermittedByKey.update
                        }
                        value={state.downtime_hours_work}
                        onChange={this.handleChange}
                        boundKeys="downtime_hours_work"
                        error={errors.downtime_hours_work}
                      />
                    </EtsBootstrap.Col>
                    <EtsBootstrap.Col md={6}>
                      <ExtField
                        id="downtime-hours-duty"
                        type="number"
                        label="Дежурство"
                        disabled={
                          IS_DELETE || (IS_CLOSED && !this.state.canEditIfClose)
                          || !isPermittedByKey.update
                        }
                        value={state.downtime_hours_duty}
                        onChange={this.handleChange}
                        boundKeys="downtime_hours_duty"
                        error={errors.downtime_hours_duty}
                      />
                    </EtsBootstrap.Col>
                  </EtsBootstrap.Row>
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={8}>
                  <EtsBootstrap.Row>
                    <EtsBootstrap.Col md={6}>
                      <ExtField
                        id="downtime-hours-dinner"
                        type="number"
                        label="Обед"
                        disabled={
                          IS_DELETE || (IS_CLOSED && !this.state.canEditIfClose)
                          || !isPermittedByKey.update
                        }
                        value={state.downtime_hours_dinner}
                        onChange={this.handleChange}
                        boundKeys="downtime_hours_dinner"
                        error={errors.downtime_hours_dinner}
                      />
                    </EtsBootstrap.Col>
                    <EtsBootstrap.Col md={6}>
                      <ExtField
                        id="downtime-hours-repair"
                        type="number"
                        label="Ремонт"
                        disabled={
                          IS_DELETE || (IS_CLOSED && !this.state.canEditIfClose)
                          || !isPermittedByKey.update
                        }
                        value={state.downtime_hours_repair}
                        onChange={this.handleChange}
                        boundKeys="downtime_hours_repair"
                        error={errors.downtime_hours_repair}
                      />
                    </EtsBootstrap.Col>
                  </EtsBootstrap.Row>
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <WaybillFooter
            isCreating={IS_CREATING}
            isDraft={IS_DRAFT}
            isClosed={IS_CLOSED}
            isActive={IS_ACTIVE}
            isDelete={IS_DELETE}
            canSave={Boolean(this.props.canSave && !this.state.missionHasError?.hasError)}
            canPrint={canWaybillPrint}
            canGiveOutRead={canWaybillGiveOutRead}
            canClose={this.props.canClose}
            formState={this.props.formState}
            state={state}
            canEditIfClose={!!this.state.canEditIfClose}
            taxesControl={taxesControl}
            refresh={this.refresh}
            handleSubmit={this.handleSubmit}
            handleClose={this.handleClose}
            handlePrint={this.handlePrint}
            handlePrintFromMiniButton={this.handlePrintFromMiniButton}
            entity={entity}
            isPermittedByKey={isPermittedByKey}
          />
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    appConfig: getSessionState(state).appConfig,
    userStructureId: getSessionState(state).userData.structure_id,
    userCompanyId: getSessionState(state).userData.company_id,
    userStructures: getSessionState(state).userData.structures,
    userPermissionsSet: getSessionState(state).userData.permissionsSet,
    fuelCardsList: getAutobaseState(state).fuelCardsList,
    workModeList: getSomeUniqState(state).workModeList,
    equipmentFuelCardsList: getAutobaseState(state).equipmentFuelCardsList,
    gasFuelCardsList: getAutobaseState(state).gasFuelCardsList,
    order_mission_source_id: getSomeUniqState(state).missionSource
      .order_mission_source_id,
    carList: getAutobaseState(state).carList,
    carIndex: getAutobaseState(state).carIndex,
    uniqEmployeesBindedOnCarList: getEmployeeState(state)
      .uniqEmployeesBindedOnCarList,
    employeeList: getEmployeeState(state).employeeList,
    employeeIndex: getEmployeeState(state).employeeIndex,
    reasonListOptions: getReasonList(state),
    waybillDriverList: getEmployeeState(state).waybillDriverList,
    moscowTimeServer: getSomeUniqState(state).moscowTimeServer,
  }),
)(WaybillForm);
