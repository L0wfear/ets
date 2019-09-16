import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import consumableMaterialPermissions from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/_config-data/permissions';
import { ConfigFormData } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { promiseSubmitConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/promise_consumable_material';
import { getRequiredFieldMessage } from 'components/@next/@utils/getErrorString/getErrorString';
import { floatValidate } from 'components/@next/@form/validate/number/numberValidate';
import { ReduxState } from 'redux-main/@types/state';
import { diffDates } from 'components/@next/@utils/dates/dates';

const validateValue = (rowData: ValuesOf<ConsumableMaterial['norms']>, indexRow: number, formState: ConsumableMaterial, reduxState: ReduxState) => {
  if (!rowData.is_without_norm) {
    if (!rowData.value && rowData.value !== 0) {
      return getRequiredFieldMessage('Норма');
    }

    const floadError = floatValidate(Number(rowData.value), 3, 'Норма');
    if (floadError) {
      return floadError;
    }
  }
};

const validateDateStart = (rowData: ValuesOf<ConsumableMaterial['norms']>, indexRow: number, formState: ConsumableMaterial, reduxState: ReduxState) => {
  if (!rowData.is_without_norm) {
    if (!rowData.date_start) {
      return getRequiredFieldMessage('Дата с.');
    }
  }
};

const validateDateEnd = (rowData: ValuesOf<ConsumableMaterial['norms']>, indexRow: number, formState: ConsumableMaterial, reduxState: ReduxState) => {
  if (!rowData.is_without_norm) {
    if (rowData.date_start) {
      if (!rowData.date_end) {
        const isNotLastRow = formState.norms.find((rowDateNorm) => (
          rowDateNorm.technical_operation_id === rowData.technical_operation_id
          && rowDateNorm.municipal_facility_id === rowData.municipal_facility_id
          && rowDateNorm.season_id === rowData.season_id
          && diffDates(rowDateNorm.date_start, rowData.date_start) > 0
        ));
        if (isNotLastRow) {
          return getRequiredFieldMessage('Дата по.');
        }
      } else {
        if (diffDates(rowData.date_start, rowData.date_end) >= 0) {
          return '"Дата по." должно быть позже "Дата с."';
        }
      }
    }
  }
};

export const metaConsumableMaterial: ConfigFormData<ConsumableMaterial> = {
  uniqField: 'id',
  bsSizeForm: 'large',
  permissions: consumableMaterialPermissions,
  handleSubmitPromise: promiseSubmitConsumableMaterial,
  schema: {
    header: {
      title: {
        create: 'Добавление расходного материала',
        update: 'Изменение расходного материала',
      },
    },
    body: {
      validate_fields: {
        name: {
          title: 'Наименование',
          type: 'string',
          required: true,
          maxLength: 50,
        },
        short_name: {
          title: 'Наименование',
          type: 'string',
          required: true,
          maxLength: 50,
        },
        measure_unit_id: {
          title: 'Единица измерения',
          type: 'valueOfArray',
          required: true,
        },
        norms: {
          type: 'any',
          title: 'Таблица нормативов',
          dependencies: [
            (norms, formState, reduxState) => {
              return norms.map((rowData, indexRow) => ({
                technical_operation_id: !rowData.technical_operation_id && getRequiredFieldMessage('Технологическая операция'),
                municipal_facility_id: !rowData.municipal_facility_id && getRequiredFieldMessage('Элемент'),
                season_id: !rowData.season_id && getRequiredFieldMessage('Сезон'),
                value: validateValue(rowData, indexRow, formState, reduxState),
                date_start: validateDateStart(rowData, indexRow, formState, reduxState),
                date_end: validateDateEnd(rowData, indexRow, formState, reduxState),
              }));
            },
          ],
        },
      },
    },
  },
  default_element: {
    id: null,
    name: '',
    short_name: '',
    measure_unit_id: null,
    measure_unit_name: '',
    norms: [],
  },
};
