import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { PropsViewInspectCarsConditionWithForm } from './@types/ViewInspectCarsContidion';
import { INSPECT_TYPE_FORM } from '../../../autobase/global_constants';

const headBalanceHolderBaseSchema: SchemaType<InspectCarsCondition['head_balance_holder_base'], PropsViewInspectCarsConditionWithForm> = {
  properties: {
    fio: {
      type: 'string',
      title: 'Руководитель предприятия:',
    },
    tel: {
      type: 'string',
      title: 'Телефон:',
    },
  },
};

const headOperatingBaseSchema: SchemaType<InspectCarsCondition['head_operating_base'], PropsViewInspectCarsConditionWithForm> = {
  properties: {
    fio: {
      type: 'string',
      title: 'Руководитель предприятия:',
    },
    tel: {
      type: 'string',
      title: 'Телефон:',
    },
  },
};

const preparingCarsCheckSchema: SchemaType<InspectCarsCondition['data']['preparing_cars_check'], PropsViewInspectCarsConditionWithForm> = {
  properties: {
    order_issued_at: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
      },
      type: 'date',
      title: 'Приказ о подготовке техники к сезону издан от',
      required: true,
    },
    order_number: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
      },
      type: 'string',
      title: '№ приказа',
      required: true,
    },
    master_plan_approved: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
      },
      type: 'string',
      title: 'Сводный план подготовки техники утвержден',
      required: true,
    },
    named_plan_approved: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
      },
      type: 'string',
      title: 'Поименный план подготовки техники утвержден',
      required: true,
    },
    planned_target: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
      },
      type: 'valueOfArray',
      title: 'Плановые показатели',
      required: true,
    },
    statements_defects_issued: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
      },
      type: 'valueOfArray',
      title: 'Ведомости дефектов на каждую единицу техники, перечисленную в поименном плане',
      required: true,
    },
    statements_defects_not_issued_cnt: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
      },
      type: 'number',
      title: 'Не оформлено ведомостей дефектов на <кол-во> единиц техник',
    },
    drawbacks_eliminated: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
      },
      type: 'string',
      title: 'Устранены ранее выявленные недостатки',
    },
    drawbacks_new: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
      },
      type: 'string',
      title: 'Новые замечани',
    },
  },
};

const headCountListCarsUseSchema: SchemaType<InspectCarsCondition['data']['cars_use'], PropsViewInspectCarsConditionWithForm> = {
  properties: {
    waybill_issue_log_exists: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'valueOfArray',
      title: 'Журнал выдачи путевых листов',
      required: true,
    },
    waybill_issue_log_used: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'valueOfArray',
      title: 'Журнал выдачи путевых листов',
      required: true,
    },
    comment: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'string',
      title: 'Комментарий',
      maxLength: 4000,
    },
    comment_detected: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'string',
      title: 'Выявлено и установлено',
      maxLength: 4000,
    },
  },
};

const headCountListSchema: SchemaType<InspectCarsCondition['data']['headcount_list'], PropsViewInspectCarsConditionWithForm> = {
  properties: {
    staff_drivers: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'number',
      title: 'Водителей',
    },
    staff_mechanics: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'number',
      title: 'Механизаторов',
    },
    list_drivers: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
        reverse: true,
      },
      required: true,
      type: 'number',
      title: 'Водителей',
      min: 0,
      max: 9999,
    },
    list_mechanics: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'number',
      title: 'Механизаторов',
      required: true,
      min: 0,
      max: 9999,
    },
    staffing_drivers: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'number',
      title: 'Водителей',
    },
    staffing_mechanics: {
      validateIf: {
        type: 'has_data',
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'number',
      title: 'Механизаторов',
    },
  },
};

const dataSchema: SchemaType<InspectCarsCondition['data'], PropsViewInspectCarsConditionWithForm> = {
  properties: {
    preparing_cars_check: {
      type: 'schema',
      schema: preparingCarsCheckSchema,
    },
    headcount_list: {
      type: 'schema',
      schema: headCountListSchema,
    },
    cars_use: {
      type: 'schema',
      schema: headCountListCarsUseSchema,
    },
  },
};

export const inspectcarsConditionormSchema: SchemaType<InspectCarsCondition, PropsViewInspectCarsConditionWithForm> = {
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
    cars_cnt: {
      type: 'number',
      title: 'Количество ТС',
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
    checked_cars_cnt: {
      type: 'number',
      title: 'Количество проверенных ТС',
      dependencies: [
        (_, { cars_cnt }, props) => {
          if (props.type === INSPECT_TYPE_FORM.list && process.env.STAND === 'prod') {
            if (!cars_cnt) {
              return 'Необходимо проверить все ТС';
            }
          }
        },
      ],
    },
    resolve_to: {
      type: 'date',
      title: 'Срок, до которого необходимо представить отчет об устранении выявленных недостатков',
    },
  },
};
