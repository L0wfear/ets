import { FiledToCheck } from 'components/new/pages/inspection/autobase/components/vsible_warning/@types/visibleWarning';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';

export const filedToCheckFall: FiledToCheck<InspectPgmBase['data']> = [
  {
    key: 'lack_traffic_scheme_at_entrance',
    title: 'Отсутствие схемы движения автотранспорта при въезде на базу',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    sub_header: 'Общие требования',
  },
  {
    key: 'type_of_base_coverage',
    title: 'Вид покрытия базы',
    type: 'select',
    multi: true,
    sub_header: 'Территория базы и подъездные пути',
    options: [
      { value: 'Щебень', label: 'Щебень' },
      { value: 'Фрезерованный асфальт', label: 'Фрезерованный асфальт' },
      { value: 'Асфальт', label: 'Асфальт' },
      { value: 'Дорожные плиты', label: 'Дорожные плиты' },
      { value: 'Гравий', label: 'Гравий' },
      { value: 'Песок', label: 'Песок' },
      { value: 'Другое', label: 'Другое' },
    ],
  },
  {
    key: 'access_roads_in_poor_condition',
    title: 'Неудовлетворительное состояние подъездных путей',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_lighting',
    title: 'Отсутствие освещения на базе',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_personal_protection',
    title: 'Отсутствие спецодежды и индивидуальных средств защиты (респиратор, перчатки и т.д.)',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    sub_header: 'Техника безопасности',
  },
  {
    key: 'lack_of_records_in_training_logs',
    title: 'В журнале отсутствуют записи о проведенных инструктажах',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_technical_passport',
    title: 'Отсутствие технического паспорта базы',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    sub_header: 'Техническая документация',
  },
  {
    key: 'lack_of_documents_on_pgm',
    title: 'Отсутствие документов на ПГМ, находящихся на базе',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_documents_etc',
    title: 'Прочее',
    type: 'string',
  },
  {
    key: 'lack_of_shower',
    title: 'Отсутствие водопровода, душа',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    sub_header: 'Бытовые помещения',
  },
  {
    key: 'lack_of_changing_rooms',
    title: 'Отсутствие раздевалок',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_rest_rooms',
    title: 'Отсутствие комнат для отдыха персонала',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_information_stands',
    title: 'Отсутствие информационных стендов',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },

  {
    key: 'lack_of_loading_unloading_mechanisms',
    title: 'Отсутствие погрузочно-разгрузочных механизмов',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    sub_header: 'Прочее',
  },
  {
    key: 'lack_of_ramps_stairs',
    title: 'Отсутствие эстакад, лестниц',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'comments',
    title: 'Замечания',
    type: 'text',
  },
];

export const filedToCheckFallHardPgm: FiledToCheck<InspectPgmBase['data']> = [
  {
    key: 'lack_of_height_restriction_sign',
    title: 'Отсутствие над въездными воротами знака ограничения высоты',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    sub_header: 'Ангары для хранения твердых (комбинированных) ПГМ',
  },
  {
    key: 'type_coverage_in_hangar',
    title: 'Вид покрытия в ангаре',
    type: 'select',
    multi: true,
    options: [
      { value: 'Щебень', label: 'Щебень' },
      { value: 'Фрезерованный асфальт', label: 'Фрезерованный асфальт' },
      { value: 'Асфальт', label: 'Асфальт' },
      { value: 'Дорожные плиты', label: 'Дорожные плиты' },
      { value: 'Гравий', label: 'Гравий' },
      { value: 'Песок', label: 'Песок' },
      { value: 'Другое', label: 'Другое' },
    ],
  },
  {
    key: 'lack_of_lighting_in_hangars',
    title: 'Отсутствие освещенности в ангарах',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_schema_slinging',
    title: 'Отсутствие схемы строповки',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'lack_of_wooden_pallets',
    title: 'Отсутствие деревянных паллет (поддонов) для хранения ПГМ',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'hangar_is_not_sealed',
    title: 'Ангар не герметичен',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'pgm_in_hangars',
    title: 'Наличие ПГМ в ангарах на момент проверки (куб.м)',
    type: 'number',
  },

  {
    key: 'insufficient_availability_of_wooden_pallets',
    title: 'Недостаточное наличие деревянных паллет (h-10)',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
    sub_header: 'Хранение ПГМ на улице',
  },
  {
    key: 'lack_of_shelter_for_solid_pgm',
    title: 'Отсутствие укрытия мешков с твердыми ПГМ (брезент, пленка)',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'pgm_on_open_area',
    title: 'Наличие ПГМ на открытой площадке на момент проверки (куб.м)',
    type: 'number',
  },
];

export const filedToCheckContainersInfo: FiledToCheck<any> = [
  {
    key: 'containers_counter',
    title: 'Количество емкостей:',
    type: 'string',
    readOnly: true,
    inline: true,
  },
  {
    key: 'summ_capacity',
    title: 'Суммарная вместимость:',
    type: 'string',
    readOnly: true,
    inline: true,
  },
  {
    key: 'pgm_volume_sum',
    title: 'Наличие ПГМ в емкостях на момент проверки (куб.м):',
    type: 'string',
    readOnly: true,
    inline: true,
  },
];

export const filedToCheckContainersFail: FiledToCheck<InspectPgmBase['data']> = [
  {
    key: 'equipment_and_piping_in_poor_condition',
    title: 'Оборудование и трубопровод находятся в неуд. состоянии',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
  {
    key: 'containers_in_poor_condition',
    title: 'Емкости находятся в неуд. состоянии (визуально)',
    type: 'boolean',
    className: 'checkbox-input flex-reverse',
  },
];
