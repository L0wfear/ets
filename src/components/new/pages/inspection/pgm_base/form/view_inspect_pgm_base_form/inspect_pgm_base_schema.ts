import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';

export const inspectAutobaeSchema: SchemaType<InspectPgmBase['data'], { type: keyof typeof INSPECT_PGM_BASE_TYPE_FORM }> = {
  properties: [
    {
      key: 'absence_of_a_shield_with_a_scheme_of_movement',
      title: 'Технологическая операция',
      type: 'boolean',
      required: true,
    },
    {
      key: 'is_under_construction',
      title: 'Автобаза находится на стадии строительства',
      type: 'boolean',
    },
    {
      key: 'is_less_than_two_entrances',
      title: 'Обустройство менее 2х въездов (выездов) на территорию базы',
      type: 'boolean',
    },
    {
      key: 'absence_of_a_shield_with_a_scheme_of_movement',
      title: 'Отсутствие щита со схемой движения по территории базы',
      type: 'boolean',
    },
    {
      key: 'is_road_signs',
      title: 'Наличие дорожных знаков на территории базы (в соответствии со схемой движения)',
      type: 'number',
    },
    {
      key: 'lack_of_fire_fighting_equipment',
      title: 'Отсутствие противопожарного оборудования',
      type: 'boolean',
    },
    {
      key: 'no_fencing',
      title: 'Отсутствие ограждения территории базы',
      type: 'boolean',
    },
    {
      key: 'fencing_in_poor_condition',
      title: 'Ограждения территории базы в неудовлетворительном состоянии',
      type: 'boolean',
    },
    {
      key: 'is_not_protected',
      title: 'Территория базы не охраняется',
      type: 'boolean',
    },
    {
      key: 'protection_is_carried',
      title: 'Охрану осуществляет',
      type: 'string',
    },
    {
      key: 'lack_of_video_surveillance',
      title: 'Отсутствие видеонаблюдения на базе',
      type: 'boolean',
    },
    {
      key: 'is_hard_surface',
      title: 'Твердое покрытие',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'surface_in_poor_condition',
      title: 'Покрытие базы в неудовлетворительном состоянии',
      type: 'boolean',
    },
    {
      key: 'surface_area_of_destruction',
      title: 'Площадь разрушения покрытия на базе',
      type: 'number',
    },
    {
      key: 'presence_of_pits_potholes',
      title: 'Наличие ям, выбоин',
      type: 'number',
    },
    {
      key: 'lack_of_lighting',
      title: 'Отсутствие освещения на базе',
      type: 'boolean',
    },
    {
      key: 'cnt_defective_light',
      title: 'Количество неисправных мачт освещения',
      type: 'number',
    },
    {
      key: 'lack_control_room',
      title: 'Отсутствие помещения для оформления путевых листов (диспетчерской)',
      type: 'boolean',
    },
    {
      key: 'lack_repair_areas',
      title: 'Отсутствие ремонтных зон',
      type: 'boolean',
    },
    {
      key: 'cnt_repair_posts',
      title: 'Количество постов для обслуживания, ремонта техники',
      type: 'number',
    },
    {
      key: 'repair_posts_in_poor_condition',
      title: 'Постов в неудовлетворительном состоянии',
      type: 'number',
    },
    {
      key: 'lack_of_storage_facilities',
      title: 'Отсутствие складских помещений на базе',
      type: 'boolean',
    },
    {
      key: 'lack_of_a_canopy_for_pgm',
      title: 'Отсутствие навеса (постоянного, быстросъемного) для хранения аварийного запаса ПГМ',
      type: 'boolean',
    },
    {
      key: 'lack_of_recreation',
      title: 'Отсутствие зон отдыха',
      type: 'boolean',
    },
    {
      key: 'lack_of_domestic',
      title: 'Отсутствие бытовых помещений на базе',
      type: 'boolean',
    },
    {
      key: 'domestic_in_poor_condition',
      title: 'Неудовлетворительное состояние бытовых помещений',
      type: 'boolean',
    },
    {
      key: 'lack_of_water_supply',
      title: 'Отсутствие водоснабжения',
      type: 'boolean',
    },
    {
      key: 'lack_of_sanitation',
      title: 'Отсутствие канализации',
      type: 'boolean',
    },
    {
      key: 'lack_of_toilets',
      title: 'Отсутствие туалетов',
      type: 'boolean',
    },
    {
      key: 'lack_shower_cabins',
      title: 'Отсутствие душевых кабин (в помещении/на открытой площадке)',
      type: 'boolean',
    },
  ],
  dependencies: {
    protection_is_carried: [
      (value, { is_not_protected }, { type }) => {
        if (type === INSPECT_PGM_BASE_TYPE_FORM.list) {
          if (!is_not_protected && !value) {
            return 'Поле "Охрану осуществляет" должно быть заполнено';
          }
        }

        return '';
      },
    ],
    cnt_repair_posts: [
      (value, { lack_repair_areas }, { type }) => {
        if (type === INSPECT_PGM_BASE_TYPE_FORM.list) {
          if (!lack_repair_areas && !value) {
            return 'Поле "Количество постов для обслуживания, ремонта техники" должно быть заполнено';
          }
        }

        return '';
      },
    ],
    cnt_defective_light: [
      (value, { lack_of_lighting }, { type }) => {
        if (type === INSPECT_PGM_BASE_TYPE_FORM.list) {
          if (!lack_of_lighting && !value) {
            return 'Поле "Количество неисправных мачт освещения" должно быть заполнено';
          }
        }

        return '';
      },
    ],
  },
};
