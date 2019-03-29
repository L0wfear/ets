import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';

export const inspectAutobaeSchema: SchemaType<InspectPgmBase['data'], { type: keyof typeof INSPECT_PGM_BASE_TYPE_FORM }> = {
  properties: [
    {
      key: 'head_balance_holder_base_fio',
      title: 'Руководитель балансодержателя',
      type: 'string',
      required: true,
    },
    {
      key: 'head_balance_holder_base_tel',
      title: 'Телефон руководителя балансодержателя',
      type: 'string',
    },
    {
      key: 'head_operating_base_fio',
      title: 'Руководитель организации, эксплуатирующей базу',
      type: 'string',
      required: true,
    },
    {
      key: 'head_operating_base_tel',
      title: 'Телефон руководителя организации, эксплуатирующей базу',
      type: 'string',
    },
    // Выявленные нарушения на базе:
    {
      key: 'lack_traffic_scheme_at_entrance',
      title: 'Отсутствие схемы движения автотранспорта при въезде на базу',
      type: 'boolean',
    },
    {
      key: 'type_of_base_coverage',
      title: 'Вид покрытия базы',
      type: 'string',
      required: true,
    },
    {
      key: 'access_roads_in_poor_condition',
      title: 'Неудовлетворительное состояние подъездных путей',
      type: 'boolean',
    },
    {
      key: 'lack_of_lighting',
      title: 'Отсутствие освещения на базе',
      type: 'boolean',
    },
    {
      key: 'lack_of_personal_protection',
      title: 'Отсутствие спецодежды и индивидуальных средств защиты (респиратор, перчатки и т.д.)',
      type: 'boolean',
    },
    {
      key: 'lack_of_records_in_training_logs',
      title: 'В журнале отсутствуют записи о проведенных инструктажах',
      type: 'boolean',
    },
    {
      key: 'lack_of_technical_passport',
      title: 'Отсутствие технического паспорта базы',
      type: 'boolean',
    },
    {
      key: 'lack_of_documents_on_pgm',
      title: 'Отсутствие документов на ПГМ, находящихся на базе',
      type: 'boolean',
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
    },
    {
      key: 'lack_of_changing_rooms',
      title: 'Отсутствие раздевалок',
      type: 'boolean',
    },
    {
      key: 'lack_of_rest_rooms',
      title: 'Отсутствие комнат для отдыха персонала',
      type: 'boolean',
    },
    {
      key: 'lack_of_information_stands',
      title: 'Отсутствие информационных стендов',
      type: 'boolean',
    },

    {
      key: 'lack_of_loading_unloading_mechanisms',
      title: 'Отсутствие погрузочно-разгрузочных механизмов',
      type: 'boolean',
    },
    {
      key: 'lack_of_ramps_stairs',
      title: 'Отсутствие эстакад, лестниц',
      type: 'boolean',
    },
    // Нарушения, связанные с хранением твердых ПГМ:
    {
      key: 'lack_of_height_restriction_sign',
      title: 'Отсутствие над въездными воротами знака ограничения высоты',
      type: 'boolean',
    },
    {
      key: 'type_coverage_in_hangar',
      title: 'Вид покрытия в ангаре',
      type: 'string',
      required: true,
    },
    {
      key: 'lack_of_lighting_in_hangars',
      title: 'Отсутствие освещенности в ангарах',
      type: 'boolean',
    },
    {
      key: 'lack_of_schema_slinging',
      title: 'Отсутствие схемы строповки',
      type: 'boolean',
    },
    {
      key: 'lack_of_wooden_pallets',
      title: 'Отсутствие деревянных паллет (поддонов) для хранения ПГМ',
      type: 'boolean',
    },
    {
      key: 'hangar_is_not_sealed',
      title: 'Ангар не герметичен',
      type: 'boolean',
    },
    {
      key: 'pgm_in_hangars',
      title: 'Наличие ПГМ в ангарах на момент проверки (тонн)',
      type: 'number',
    },

    {
      key: 'insufficient_availability_of_wooden_pallets',
      title: 'Недостаточное наличие деревянных паллет (h-10)',
      type: 'boolean',
    },
    {
      key: 'lack_of_shelter_for_solid_pgm',
      title: 'Отсутствие укрытия мешков с твердыми ПГМ (брезент, пленка)',
      type: 'boolean',
    },
    {
      key: 'pgm_on_open_area',
      title: 'Наличие ПГМ на открытой площадке на момент проверки (тонн)',
      type: 'number',
    },
  ],
  dependencies: {
  },
};
