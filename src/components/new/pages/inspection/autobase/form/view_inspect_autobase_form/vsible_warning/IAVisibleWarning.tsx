import * as React from 'react';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { ExtField } from 'components/ui/new/field/ExtField';
import { groupBy, get } from 'lodash';
import { IAVisibleWarningInputContainer } from './styled/IAVisibleWarning';
import { DivNone } from 'global-styled/global-styled';

type IAVisibleWarningProps = {
  onChange: (data: InspectAutobase['data']) => void;
  data: InspectAutobase['data'];
  errors: Partial<Record<keyof InspectAutobase['data'], string>>;
  isPermitted: boolean;
};

const filedToCheck = [
  {
    key: 'is_under_construction',
    title: 'Автобаза находится на стадии строительства',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'is_less_than_two_entrances',
    title: 'Обустройство менее 2х въездов (выездов) на территорию базы',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'absence_of_a_shield_with_a_scheme_of_movement',
    title: 'Отсутствие щита со схемой движения по территории базы',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
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
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'no_fencing',
    title: 'Отсутствие ограждения территории базы',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    reset: ['fencing_in_poor_condition'],
  },
  {
    key: 'fencing_in_poor_condition',
    title: 'Ограждения территории базы в неудовлетворительном состоянии',
    type: 'boolean',
    sub: 20,
    hidden: 'no_fencing',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'is_not_protected',
    title: 'Территория базы не охраняется',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    reset: ['protection_is_carried'],
  },
  {
    key: 'protection_is_carried',
    title: 'Охрану осуществляет',
    type: 'string',
    sub: 20,
    hidden: 'is_not_protected',
  },
  {
    key: 'lack_of_video_surveillance',
    title: 'Отсутствие видеонаблюдения на базе',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'is_hard_surface',
    title: 'Твердое покрытие',
    type: 'select',
    options: [
      { value: 'Щебень', label: 'Щебень' },
      { value: 'Фрезерованный асфальт', label: 'Фрезерованный асфальт' },
      { value: 'Асфальт', label: 'Асфальт' },
      { value: 'Дорожные плиты', label: 'Дорожные плиты' },
      { value: 'Другое', label: 'Другое' },
    ],
  },
  {
    key: 'surface_in_poor_condition',
    title: 'Покрытие базы в неудовлетворительном состоянии',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
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
    className: 'checkbox-input flex-reverse',
    reset: ['cnt_defective_light'],
  },
  {
    key: 'cnt_defective_light',
    title: 'Количество неисправных мачт освещения',
    type: 'number',
    sub: 20,
    hidden: 'lack_of_lighting',
  },
  {
    key: 'lack_control_room',
    title: 'Отсутствие помещения для оформления путевых листов (диспетчерской)',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_repair_areas',
    title: 'Отсутствие ремонтных зон',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    reset: ['cnt_repair_posts', 'repair_posts_in_poor_condition'],
  },
  {
    key: 'cnt_repair_posts',
    title: 'Количество постов для обслуживания, ремонта техники',
    type: 'number',
    sub: 20,
    hidden: 'lack_repair_areas',
  },
  {
    key: 'repair_posts_in_poor_condition',
    title: 'Постов в неудовлетворительном состоянии',
    type: 'number',
    sub: 20,
    hidden: 'lack_repair_areas',
  },
  {
    key: 'lack_of_storage_facilities',
    title: 'Отсутствие складских помещений на базе',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_a_canopy_for_pgm',
    title: 'Отсутствие навеса (постоянного, быстросъемного) для хранения аварийного запаса ПГМ',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_recreation',
    title: 'Отсутствие зон отдыха',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_domestic',
    title: 'Отсутствие бытовых помещений на базе',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    reset: ['domestic_in_poor_condition'],
  },
  {
    key: 'domestic_in_poor_condition',
    title: 'Неудовлетворительное состояние бытовых помещений',
    type: 'boolean',
    sub: 20,
    hidden: 'lack_of_domestic',
    className: 'checkbox-input flex-reverse',
  },

  {
    key: 'lack_of_water_supply',
    title: 'Отсутствие водоснабжения',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_sanitation',
    title: 'Отсутствие канализации',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_toilets',
    title: 'Отсутствие туалетов',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_shower_cabins',
    title: 'Отсутствие душевых кабин (в помещении/на открытой площадке)',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
];

const filedToCheckByKey: any = groupBy(filedToCheck, 'key');

const getValueFromEvent = (key, value) => {
  switch (filedToCheckByKey[key][0].type) {
    case 'boolean': return get(value, 'target.checked', null);
    case 'number':
    case 'string': return get(value, 'target.value', null);
    case 'select': return value;
  }
};

const IAVisibleWarning: React.FC<IAVisibleWarningProps> = (props) => {
  const { data } = props;

  const handleChange = React.useCallback(
    (key, value) => {
      const changeObj = {
        ...data,
        [key]: getValueFromEvent(key, value),
      };

      if (filedToCheckByKey[key][0].reset) {
        filedToCheckByKey[key][0].reset.forEach((keyResetField) => {
          changeObj[keyResetField] = null;
        });
      }

      props.onChange(changeObj);
    },
    [data],
  );

  return (
    <>
      {
        filedToCheck.map((fieldData) => (
          <IAVisibleWarningInputContainer key={fieldData.key} sub={fieldData.sub}>
            {
              !fieldData.hidden || fieldData.hidden && !data[fieldData.hidden]
                ? (
                  <ExtField
                    id={fieldData.key}
                    type={fieldData.type}
                    label={fieldData.title}
                    value={get(data, fieldData.key, null)}
                    boundKeys={fieldData.key}
                    onChange={handleChange}
                    className={fieldData.className}
                    options={fieldData.options}
                    disabled={!props.isPermitted}
                    error={props.errors[fieldData.key]}
                  />
                )
                : (
                  <DivNone />
                )
            }
          </IAVisibleWarningInputContainer>
        ))
      }
    </>
  );
};

export default React.memo(IAVisibleWarning);
