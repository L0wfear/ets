import withFormContext, { DefaultPropsWithFormContext } from 'components/new/utils/context/form/hook/withFormContext';
import { waybillFormSchema } from './schema';
import maintenanceWorkPermissions from '../../_config-data/permissions';
import { getDefaultWaybillElement } from './utils';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { submitWaybill, promiseGetWaybillById } from 'redux-main/reducers/modules/waybill/promises/waybill_promises';
import { WaybillFormStoreType } from './@types';

/**
 * Статусы берём селекторами (useFormDataIsClosed)
 */
export default withFormContext<Waybill, DefaultPropsWithFormContext<Waybill>, WaybillFormStoreType>({
  key: 'waybill_form',
  uniqField: 'id',
  mergeElement: getDefaultWaybillElement,
  schema: waybillFormSchema,
  permissions: maintenanceWorkPermissions,

  loadItemPromise: promiseGetWaybillById,
  handleSubmitPromise: submitWaybill,
  bsSizeForm: 'large',

  store: {
    mission_reject_list: {
      value: [],
      isLoading: false,
    },
    mission_list: {
      value: [],
      isLoading: false,
    },
    structure_id: {
      options: [],
      isLoading: false,
    },
    employee: {
      listIndex: {},
      options: [],
      isLoading: false,
    },
    carActualList: {
      options: [],
      isLoading: false,
    },
    employeeBindedToCar: {
      list: [],
      isLoading: false,
    },
    medicalStatsAllowedDrivers: {
      list: [],
      isLoading: false,
    },
    workModeOptions: {
      options: [],
      isLoading: false,
    },
    carRefillFuelCardsOptions: {
      listIndex: {},
      options: [],
      isLoading: false,
    },
    fuelCardsList: {
      list: [],
      isLoading: false,
    },
    refillTypeList: {
      list: [],
      isLoading: false,
    },
    refillTypeOptions: {
      options: [],
      isLoading: false,
    },
  },
});
