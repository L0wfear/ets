import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';

export const inspectAutobaeSchema: SchemaType<InspectAutobase['data'], { type: keyof typeof INSPECT_AUTOBASE_TYPE_FORM }> = {
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
          if (type === INSPECT_AUTOBASE_TYPE_FORM.list) {
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
      type: 'valueOfArray',
      required: true,
    },
    surface_in_poor_condition: {
      title: 'Покрытие базы в неудовлетворительном состоянии',
      type: 'boolean',
    },
    surface_area_of_destruction: {
      title: 'Площадь разрушения покрытия на базе (кв. м)',
      type: 'number',
    },
    presence_of_pits_potholes: {
      title: 'Наличие ям, выбоин (шт.)',
      type: 'number',
    },
    lack_of_lighting: {
      title: 'Отсутствие освещения на базе',
      type: 'boolean',
    },
    cnt_defective_light: {
      title: 'Количество неисправных мачт освещения (шт.)',
      type: 'number',
      minNotEqual: -1,
      integer: true,

      dependencies: [
        (value, { lack_of_lighting }, { type }) => {
          if (type === INSPECT_AUTOBASE_TYPE_FORM.list) {
            if (!lack_of_lighting && !value) {
              return 'Поле "Количество неисправных мачт освещения (шт.)" должно быть заполнено';
            }
          }

          return '';
        },
      ],
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
      minNotEqual: -1,
      integer: true,

      dependencies: [
        (value, { lack_repair_areas }, { type }) => {
          if (type === INSPECT_AUTOBASE_TYPE_FORM.list) {
            if (!lack_repair_areas && !value) {
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
  },
};
