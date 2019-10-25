import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { PropsViewInspectPgmBaseWithForm } from './@types/ViewInspectPgmBase';
import { INSPECT_TYPE_FORM } from '../../../autobase/global_constants';

const headBalanceHolderBaseSchema: SchemaType<InspectPgmBase['head_balance_holder_base'], PropsViewInspectPgmBaseWithForm> = {
  properties: {
    fio: {
      type: 'string',
      title: 'Руководитель балансодержателя',
      required: true,
    },
    tel: {
      type: 'string',
      title: 'Телефон руководителя балансодержателя',
    },
  },
};

const headOperatingBaseSchema: SchemaType<InspectPgmBase['head_operating_base'], PropsViewInspectPgmBaseWithForm> = {
  properties: {
    fio: {
      type: 'string',
      title: 'Руководитель организации, эксплуатирующей базу',
      required: true,
    },
    tel: {
      type: 'string',
      title: 'Телефон руководителя организации, эксплуатирующей базу',
    },
  },
};

const dataSchema: SchemaType<InspectPgmBase['data'], PropsViewInspectPgmBaseWithForm> = {
  properties: {
    lack_traffic_scheme_at_entrance: {
      title: 'Отсутствие схемы движения автотранспорта при въезде на базу',
      type: 'boolean',
    },
    type_of_base_coverage: {
      title: 'Вид покрытия базы',
      type: 'multiValueOfArray',
      dependencies: [
        (value) => {
          if (!value.length) {
              return 'Поле "Вид покрытия базы" должно быть заполнено';
          }
          return '';
        },
      ],
    },
    access_roads_in_poor_condition: {
      title: 'Неудовлетворительное состояние подъездных путей',
      type: 'boolean',
    },
    lack_of_lighting: {
      title: 'Отсутствие освещения на базе',
      type: 'boolean',
    },
    lack_of_personal_protection: {
      title: 'Отсутствие спецодежды и индивидуальных средств защиты (респиратор, перчатки и т.д.)',
      type: 'boolean',
    },
    lack_of_records_in_training_logs: {
      title: 'В журнале отсутствуют записи о проведенных инструктажах',
      type: 'boolean',
    },
    lack_of_technical_passport: {
      title: 'Отсутствие технического паспорта базы',
      type: 'boolean',
    },
    lack_of_documents_on_pgm: {
      title: 'Отсутствие документов на ПГМ, находящихся на базе',
      type: 'boolean',
    },
    lack_of_documents_etc: {
      title: 'Прочее',
      type: 'string',
    },
    lack_of_shower: {
      title: 'Отсутствие водопровода, душа',
      type: 'boolean',
    },
    lack_of_changing_rooms: {
      title: 'Отсутствие раздевалок',
      type: 'boolean',
    },
    lack_of_rest_rooms: {
      title: 'Отсутствие комнат для отдыха персонала',
      type: 'boolean',
    },
    lack_of_information_stands: {
      title: 'Отсутствие информационных стендов',
      type: 'boolean',
    },
    lack_of_loading_unloading_mechanisms: {
      title: 'Отсутствие погрузочно-разгрузочных механизмов',
      type: 'boolean',
    },
    lack_of_ramps_stairs: {
      title: 'Отсутствие эстакад, лестниц',
      type: 'boolean',
    },
    comments: {
      title: 'Замечания',
      type: 'string',
    },
    // Нарушения, связанные с хранением твердых ПГМ:
    lack_of_height_restriction_sign: {
      title: 'Отсутствие над въездными воротами знака ограничения высоты',
      type: 'boolean',
    },
    type_coverage_in_hangar: {
      title: 'Вид покрытия в ангаре',
      type: 'multiValueOfArray',
      dependencies: [
        (value) => {
          if (!value.length) {
              return 'Поле "Вид покрытия в ангаре" должно быть заполнено';
          }
          return '';
        },
      ],
    },
    lack_of_lighting_in_hangars: {
      title: 'Отсутствие освещенности в ангарах',
      type: 'boolean',
    },
    lack_of_schema_slinging: {
      title: 'Отсутствие схемы строповки',
      type: 'boolean',
    },
    lack_of_wooden_pallets: {
      title: 'Отсутствие деревянных паллет (поддонов) для хранения ПГМ',
      type: 'boolean',
    },
    hangar_is_not_sealed: {
      title: 'Ангар не герметичен',
      type: 'boolean',
    },
    pgm_in_hangars: {
      title: 'Наличие ПГМ в ангарах на момент проверки (куб.м)',
      type: 'number',
      min: 0,
      integer: true,
    },
    insufficient_availability_of_wooden_pallets: {
      title: 'Недостаточное наличие деревянных паллет (h-10)',
      type: 'boolean',
    },
    lack_of_shelter_for_solid_pgm: {
      title: 'Отсутствие укрытия мешков с твердыми ПГМ (брезент, пленка)',
      type: 'boolean',
    },
    pgm_on_open_area: {
      title: 'Наличие ПГМ на открытой площадке на момент проверки (куб.м)',
      type: 'number',
      min: 0,
      integer: true,
    },
  },
};

export const inspectPgmBaseSchema: SchemaType<InspectPgmBase, PropsViewInspectPgmBaseWithForm> = {
  properties: {
    head_balance_holder_base: {
      type: 'schema',
      schema: headBalanceHolderBaseSchema,
    },
    head_operating_base: {
      type: 'schema',
      schema: headOperatingBaseSchema,
    },
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
