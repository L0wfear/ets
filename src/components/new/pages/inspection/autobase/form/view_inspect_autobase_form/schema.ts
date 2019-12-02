
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { PropsViewInspectAutobaseWithForm } from './@types/ViewInspectAutobase';
import { INSPECT_TYPE_FORM } from '../../global_constants';
import { getRequiredFieldMoreEqualThen } from 'components/@next/@utils/getErrorString/getErrorString';

const dataSchema: SchemaType<InspectAutobase['data'], PropsViewInspectAutobaseWithForm> = {
  properties: {
    is_under_construction: {
      title: 'Автобаза находится на стадии строительства',
      type: 'boolean',
    },
    is_less_than_two_entrances: {
      title: 'Обустройство менее 2х въездов (выездов) на территорию базы',
      type: 'boolean',
    },
    absence_of_a_shield_with_a_scheme_of_movement: {
      title: 'Отсутствие щита со схемой движения по территории базы',
      type: 'boolean',
    },
    is_road_signs: {
      title: 'Наличие дорожных знаков на территории базы (в соответствии со схемой движения)',
      type: 'number',
      required: true,
      minNotEqual: -1,
      integer: true,
    },
    lack_of_fire_fighting_equipment: {
      title: 'Отсутствие противопожарного оборудования',
      type: 'boolean',
    },
    no_fencing: {
      title: 'Отсутствие ограждения территории базы',
      type: 'boolean',
    },
    fencing_in_poor_condition: {
      title: 'Ограждения территории базы в неудовлетворительном состоянии',
      type: 'boolean',
    },
    is_not_protected: {
      title: 'Территория базы не охраняется',
      type: 'boolean',
    },
    protection_is_carried: {
      title: 'Охрану осуществляет',
      type: 'string',
      dependencies: [
        (value, { is_not_protected }, { type }) => {
          if (type === INSPECT_TYPE_FORM.list) {
            if (!is_not_protected && !value) {
              return 'Поле "Охрану осуществляет" должно быть заполнено';
            }
          }

          return '';
        },
      ],
    },
    lack_of_video_surveillance: {
      title: 'Отсутствие видеонаблюдения на базе',
      type: 'boolean',
    },
    is_hard_surface: {
      title: 'Твердое покрытие',
      type: 'multiValueOfArray',
      required: true,
    },
    surface_in_poor_condition: {
      title: 'Покрытие базы в неудовлетворительном состоянии',
      type: 'boolean',
    },
    surface_area_of_destruction: {
      title: 'Площадь разрушения покрытия на базе (кв. м)',
      type: 'number',
      minNotEqual: -1,
      integer: true,
    },
    presence_of_pits_potholes: {
      title: 'Наличие ям, выбоин (шт.)',
      type: 'number',
      minNotEqual: -1,
      integer: true,
    },
    lack_of_lighting: {
      title: 'Отсутствие освещения на базе',
      type: 'boolean',
    },
    cnt_defective_light: {
      title: 'Количество неисправных опор освещения (шт.)',
      type: 'number',
      minNotEqual: -1,
      integer: true,
    },
    lack_control_room: {
      title: 'Отсутствие помещения для оформления путевых листов (диспетчерской)',
      type: 'boolean',
    },
    lack_repair_areas: {
      title: 'Отсутствие ремонтных зон',
      type: 'boolean',
    },
    cnt_repair_posts: {
      title: 'Количество постов для обслуживания, ремонта техники (шт.)',
      type: 'number',
      integer: true,

      minNotEqual: 0,
      dependencies: [
        (value, { lack_repair_areas }, { type }) => {
          if (type === INSPECT_TYPE_FORM.list) {
            if (!lack_repair_areas && !value && value !== 0) {
              return 'Поле "Количество постов для обслуживания, ремонта техники" должно быть заполнено';
            }
          }

          return '';
        },
      ],
    },
    repair_posts_in_poor_condition: {
      title: 'Постов в неудовлетворительном состоянии (шт.)',
      type: 'number',
      minNotEqual: -1,
      integer: true,
      dependencies: [
        (value, { cnt_repair_posts }, { type }) => {
          if (type === INSPECT_TYPE_FORM.list) {
            if ((!value && cnt_repair_posts ) || value > cnt_repair_posts) {
              return getRequiredFieldMoreEqualThen('Постов в неудовлетворительном состоянии (шт.)', 'Количество постов для обслуживания, ремонта техники (шт.)');
            }
          }

          return '';
        },
      ]
    },
    lack_of_storage_facilities: {
      title: 'Отсутствие складских помещений на базе',
      type: 'boolean',
    },
    lack_of_a_canopy_for_pgm: {
      title: 'Отсутствие навеса (постоянного, быстросъемного) для хранения аварийного запаса ПГМ',
      type: 'boolean',
    },
    lack_of_washing: {
      title: 'Отсутствие моек на базе (стационарная/мобильная)',
      type: 'boolean',
    },
    lack_of_recreation: {
      title: 'Отсутствие зон отдыха',
      type: 'boolean',
    },
    lack_of_domestic: {
      title: 'Отсутствие бытовых помещений на базе',
      type: 'boolean',
    },
    domestic_in_poor_condition: {
      title: 'Неудовлетворительное состояние бытовых помещений',
      type: 'boolean',
    },
    lack_of_water_supply: {
      title: 'Отсутствие водоснабжения',
      type: 'boolean',
    },
    lack_of_sanitation: {
      title: 'Отсутствие канализации',
      type: 'boolean',
    },
    lack_of_toilets: {
      title: 'Отсутствие туалетов',
      type: 'boolean',
    },
    lack_shower_cabins: {
      title: 'Отсутствие душевых кабин (в помещении/на открытой площадке)',
      type: 'boolean',
    },
    comments: {
      title: 'Замечания',
      type: 'string',
    },
  },
};

export const inspectAutobaseSchema: SchemaType<InspectAutobase, PropsViewInspectAutobaseWithForm> = {
  properties: {
    data: {
      type: 'schema',
      schema: dataSchema,
    },
    commission_members: {
      type: 'multiValueOfArray',
      title: 'Проверяющие от Доринвеста',
      dependencies: [
        (agents_from_gbu, _, props) => {
          if (!agents_from_gbu.length) {
            return `* для ${
              props.type === INSPECT_TYPE_FORM.list
                ? 'завершения'
                : 'изменения'
            } проверки необходимо добавить хотя бы одного проверяющего от Доринвеста`;
          }
        },
      ],
    },
    agents_from_gbu: {
      type: 'multiValueOfArray',
      title: 'Представители ГБУ',
      dependencies: [
        (agents_from_gbu, _, props) => {
          if (!agents_from_gbu.length) {
            return `* для ${
              props.type === INSPECT_TYPE_FORM.list
                ? 'завершения'
                : 'изменения'
            } проверки необходимо добавить хотя бы одного представителя ГБУ`;
          }
        },
      ],
    },
    resolve_to: {
      type: 'datetime',
      title: 'Срок, до которого необходимо представить отчет об устранении выявленных недостатков',
    },
  },
};
