import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import inspectCarsConditionPermissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';

export const registryKey = 'InspectCarsConditionsCarsRegistry';

export const getConfig = (array: CarsConditionCars[]): TypeConfigData<CarsConditionCars> => ({
  noInitialLoad: true,
  Service: {},
  registryKey,
  header: {
    title: '',
    buttons: [
      {
        id: 'open-show_card-form',
        type: buttonsTypes.read,
        title: 'Посмотреть карточку',
        glyph: 'none',
        other_params: {
          otherUniqKeyForParamsData: null,
          type: null,
          typeRightView: 'car_info',
          selectedCarsConditionsCar: {
            path: 'id',
          },
        },
      },
    ],
  },
  filter: {
    fields: [],
  },
  list: {
    permissions: inspectCarsConditionPermissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'id', // @todo
      array,
    },
    meta: {
      row_double_click: false,
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'was_resaved',
          title: 'Статус проверки',
          width: 100,
          format: 'checkOrExpect',
        },
        {
          key: 'gov_number',
          title: 'Гос. номер',
          width: 100,
        },
        {
          key: 'marka',
          title: 'Марка',
          width: 100,
        },
        {
          key: 'model',
          title: 'Модель',
          width: 100,
        },
        {
          key: 'type',
          title: 'Тип ТС',
          width: 200,
        },
        {
          key: 'fact_status_text',
          title: 'Статус',
          width: 100,
        },
      ],
    },
    processed: {
      sort: {
        field: 'was_resaved',
      },
    },
  },
});
