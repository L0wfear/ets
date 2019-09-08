import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import missionTemplatePermissions from './permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'MissionTemplate';

export const config: TypeConfigData<MissionTemplate> = {
  Service: {
    getRegistryData: {
      entity: 'mission_template',
      typeAns: 'result',
    },
    removeOneData: {
      entity: 'mission_template',
      uniqKeyLikeQueryString: true,
    },
  },
  registryKey,
  header: {
    title: 'Шаблоны заданий',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.create,
      buttonsTypes.read,
      buttonsTypes.remove,
      buttonsTypes.missions_by_templates,
      {
        id: 'open-copy-form',
        type: buttonsTypes.read,
        title: 'Копировать',
        glyph: 'copy',
        other_params: {
          type: buttonsTypes.create,
        },
      },
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'number',
        title: 'Номер',
        type: 'multiselect',
      },
      {
        valueKey: 'name',
        title: 'Наименование',
        type: 'multiselect',
      },
      {
        valueKey: 'car_ids',
        title: 'Рег. номер ТС',
        type: 'multiselect',
        getRegistryData: {
          entity: 'filters/mission_template/cars',
          valueKey: 'asuods_id',
          labelKey: 'gov_number',
        },
      },
      {
        valueKey: 'car_type_names',
        title: 'Тип техники',
        type: 'multiselect',
      },
      {
        valueKey: 'route_id',
        labelKey: 'route_name',
        title: 'Маршрут',
        type: 'multiselect',
      },
      {
        valueKey: 'passes_count',
        title: 'Количество циклов',
        type: 'multiselect',
      },
      {
        valueKey: 'technical_operation_id',
        labelKey: 'technical_operation_name',
        title: 'Технологическая операция',
        type: 'multiselect',
      },
      {
        valueKey: 'municipal_facility_id',
        labelKey: 'municipal_facility_name',
        title: 'Элемент',
        type: 'multiselect',
      },
      {
        valueKey: 'for_column',
        title: 'Колонна',
        type: 'multiselect',
        options: [
          { value: true, label: 'Да' },
          { value: false, label: 'Нет' },
        ],
      },
      {
        valueKey: 'structure_id',
        labelKey: 'structure_name',
        type: 'multiselect',
        title: [
          {
            displayIf: displayIfContant.lenghtStructureMoreOne,
            title: 'Подразделение',
          },
        ],
      },
      {
        valueKey: 'comment',
        title: 'Комментарий',
        type: 'advanced-string-like',
      },
    ],
  },
  list: {
    permissions: missionTemplatePermissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'mission_template_id',

      proxyCheckData: 'mission_template',
    },
    meta: {
      fields: [
        {
          key: 'checkbox',
        },
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'number',
          title: 'Номер',
          width: 100,
        },
        {
          key: 'name',
          title: 'Наименование',
          width: 200,
        },
        {
          key: 'car_gov_numbers_text',
          title: 'Рег. номер ТС',
          width: 200,
        },
        {
          key: 'car_type_names',
          title: 'Тип техники',
          width: 200,
        },
        {
          key: 'route_name',
          title: 'Маршрут',
          width: 150,
        },
        {
          key: 'passes_count',
          title: 'Количество циклов',
          width: 200,
        },
        {
          key: 'technical_operation_name',
          title: 'Технологическая операция',
          width: 300,
        },
        {
          key: 'municipal_facility_name',
          title: 'Элемент',
          width: 200,
        },
        {
          key: 'for_column',
          title: 'Колонна',
          format: 'yesOrNot',
          width: 100,
        },
        {
          key: 'structure_name',
          title: [
            {
              displayIf: displayIfContant.lenghtStructureMoreOne,
              title: 'Подразделение',
            },
          ],
          dashIfEmpty: true,
          width: 150,
        },
        {
          key: 'comment',
          title: 'Комментарий',
          width: 150,
        },
      ],
    },
    processed: {
      sort: {
        field: 'number',
        reverse: true,
      },
    },
  },
};
