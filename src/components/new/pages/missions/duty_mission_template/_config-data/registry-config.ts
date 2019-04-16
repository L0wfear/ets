import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import dutyMissionTemplatePermissions from './permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'DutyMissionTemplate';

export const config: TypeConfigData<DutyMissionTemplate> = {
  Service: {
    getRegistryData: {
      entity: 'duty_mission_template',
      typeAns: 'result',
      format: 'dutyMissionTemplate',
    },
    removeOneData: {
      entity: 'duty_mission_template',
      uniqKeyLikeQueryString: true,
    },
  },
  registryKey,
  header: {
    title: 'Шаблоны наряд-заданий',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.create,
      buttonsTypes.read,
      buttonsTypes.remove,
      buttonsTypes.duty_missions_by_templates,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'number',
        type: 'advanced-number',
        title: 'Номер',
        step: 1,
      },
      {
        valueKey: 'route_name',
        type: 'multiselect',
        title: 'Маршрут',
      },
      {
        valueKey: 'technical_operation_name',
        type: 'multiselect',
        title: 'Технологическая операция',
      },
      {
        valueKey: 'municipal_facility_name',
        type: 'multiselect',
        title: 'Элемент',
      },
      {
        valueKey: 'foreman_fio',
        type: 'multiselect',
        title: 'Бригадир',
      },
      {
        valueKey: 'brigade_employee_id_list_id',
        type: 'multiselect',
        title: 'Бригада',
        getRegistryData: {
          entity: 'employee',
          valueKey: 'id',
          labelKey: 'full_name',
          mergeWithArray: true,
        },
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
    ],
  },
  list: {
    permissions: dutyMissionTemplatePermissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'duty_mission_template_id',
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
          key: 'route_name',
          title: 'Маршрут',
          width: 150,
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
          key: 'foreman_fio',
          title: 'Бригадир',
          width: 150,
        },
        {
          key: 'brigade_employee_id_list_fio',
          title: 'Бригада',
          format: 'array',
          width: 300,
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
