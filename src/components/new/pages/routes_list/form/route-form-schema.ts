import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
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
  properties: {
    name: {
      title: 'Название маршрута',
      type: 'string',
      required: true,
      dependencies: [
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
    },
    technical_operation_id: {
      title: 'Технологическая операция',
      type: 'valueOfArray',
      required: true,
    },
    municipal_facility_id: {
      title: 'Элемент',
      type: 'valueOfArray',
      required: true,
    },
    structure_id: {
      title: 'Подразделение',
      type: 'valueOfArray',
    },
    type: {
      title: 'Тип объекта',
      type: 'string',
      dependencies: [
        (value, formState) => {
          const triggerOnError
            = isNumber(formState.technical_operation_id)
            && isNumber(formState.municipal_facility_id)
            && !value;

          if (triggerOnError) {
            return 'Поле "Тип объекта" должно быть заполнено';
          }

          return '';
        },
      ],
    },
    work_type_code: {
      title: 'Способ уборки ',
      type: 'valueOfArray',
      dependencies: [
        (value, formState) => {
          const triggerOnError
            = isNumber(formState.technical_operation_id)
            && isNumber(formState.municipal_facility_id)
            && !value;

          if (triggerOnError) {
            return 'Поле "Способ уборки" должно быть заполнено';
          }

          return '';
        },
      ],
    },
    object_list: {
      type: 'multiValueOfArray',
      title: 'Список выбранных геообъектов',
      dependencies: [
        (value, formState, props) => {
          const { draw_object_list, type } = formState;
          if (
            type
            && !draw_object_list.length
            && !value.length
            && type !== 'mixed'
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
    },
    draw_object_list: {
      type: 'multiValueOfArray',
      title: 'Список выбранных геообъектов',
      dependencies: [
        (value, formState) => {
          const { object_list, type } = formState;
          if (type !== 'mixed' && !object_list.length && !value.length) {
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
    },
    input_lines: {
      type: 'multiValueOfArray',
      title: 'Список объектов, построенных вручную',
      dependencies: [
        (value, formState) => {
          const { object_list, type } = formState;
          if (!object_list.length && type === 'mixed' && !value.length) {
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
  },
};
