import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import {
  PropsRouteWithForm,
  FormStateRouteForm,
} from 'components/new/pages/routes_list/form/RouteForm.h';

import { isNumber } from 'util';
import { routeTypesByKey } from 'constants/route';

import { get } from 'lodash';

export const routeFormSchema: SchemaType<
  FormStateRouteForm,
  PropsRouteWithForm
> = {
  properties: [
    {
      key: 'name',
      title: 'Название маршрута',
      type: 'string',
      required: true,
    },
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'municipal_facility_id',
      title: 'Элемент',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'structure_id',
      title: 'Подразделение',
      type: 'valueOfArray',
    },
    {
      key: 'type',
      title: 'Тип объекта',
      type: 'string',
    },
  ],
  dependencies: {
    name: [
      (value, formState, props) => {
        if (value) {
          const { routesMapNameId } = props;

          const hasInRoutesName = routesMapNameId && routesMapNameId.has(value);
          if (hasInRoutesName && routesMapNameId.get(value) !== formState.id) {
            return 'Маршрут с данным названием уже существует';
          }
        }

        return '';
      },
    ],
    type: [
      (value, formState) => {
        const triggerOnError =
          isNumber(formState.technical_operation_id) &&
          isNumber(formState.municipal_facility_id) &&
          !value;

        if (triggerOnError) {
          return 'Поле "Тип объекта" должно быть заполнено';
        }

        return '';
      },
    ],
    object_list: [
      (value, formState, props) => {
        const { draw_object_list, type } = formState;
        if (
          type &&
          !draw_object_list.length &&
          !value.length &&
          type !== 'mixed'
        ) {
          const title = get(routeTypesByKey, `${type}.title`, null);
          if (title) {
            return `Поле "Список выбранных "${
                title
              }" должно быть заполнено`;
          }
        }

        return '';
      },
    ],
    draw_object_list: [
      (value, formState) => {
        const { object_list, type } = formState;

        if (type && !object_list.length && !value.length) {
          const title = get(routeTypesByKey, `${type}.title`, null);
          if (title) {
            return `Поле "Список выбранных "${
                title
              }" должно быть заполнено, либо построен маршрут вручную`;
          }
        }

        return '';
      },
    ],
  },
};
