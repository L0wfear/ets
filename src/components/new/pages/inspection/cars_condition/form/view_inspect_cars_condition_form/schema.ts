import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { PropsViewInspectCarsConditionWithForm } from './@types/ViewInspectCarsContidion';
import { INSPECT_AUTOBASE_TYPE_FORM } from '../../../autobase/global_constants';

const headBalanceHolderBaseSchema: SchemaType<InspectCarsCondition['head_balance_holder_base'], PropsViewInspectCarsConditionWithForm> = {
  properties: {
    fio: {
      type: 'string',
      title: 'Руководитель предприятия:',
      required: true,
    },
    tel: {
      type: 'string',
      title: 'Телефон:',
      required: true,
    },
  },
};

const headOperatingBaseSchema: SchemaType<InspectCarsCondition['head_operating_base'], PropsViewInspectCarsConditionWithForm> = {
  properties: {
    fio: {
      type: 'string',
      title: 'Руководитель предприятия:',
      required: true,
    },
    tel: {
      type: 'string',
      title: 'Телефон:',
      required: true,
    },
  },
};

const preparingCarsCheckSchema: SchemaType<InspectCarsCondition['data']['preparing_cars_check'], PropsViewInspectCarsConditionWithForm> = {
  properties: {
    order_issued_at: {
      validateIf: {
        path: 'checks_period_text',
      },
      type: 'date',
      title: 'Приказ о подготовке техники к сезону издан от',
      required: true,
    },
    order_number: {
      validateIf: {
        path: 'checks_period_text',
      },
      type: 'string',
      title: '№ приказа',
      required: true,
    },
    master_plan_approved: {
      validateIf: {
        path: 'checks_period_text',
      },
      type: 'string',
      title: 'Сводный план подготовки техники утвержден',
      required: true,
    },
    named_plan_approved: {
      validateIf: {
        path: 'checks_period_text',
      },
      type: 'string',
      title: 'Поименный план подготовки техники утвержден',
      required: true,
    },
    planned_target: {
      validateIf: {
        path: 'checks_period_text',
      },
      type: 'valueOfArray',
      title: 'Плановые показатели',
      required: true,
    },
    statements_defects_issued: {
      validateIf: {
        path: 'checks_period_text',
      },
      type: 'valueOfArray',
      title: 'Ведомости дефектов на каждую единицу техники, перечисленную в поименном плане',
      required: true,
    },
    statements_defects_not_issued_cnt: {
      validateIf: {
        path: 'checks_period_text',
      },
      type: 'number',
      title: 'Не оформлено ведомостей дефектов на <кол-во> единиц техник',
    },
    drawbacks_eliminated: {
      validateIf: {
        path: 'checks_period_text',
      },
      type: 'string',
      title: 'Устранены ранее выявленные недостатки',
      required: true,
    },
    drawbacks_new: {
      validateIf: {
        path: 'checks_period_text',
      },
      type: 'string',
      title: 'Новые замечани',
      required: true,
    },
  },
};

const headCountListCarsUseSchema: SchemaType<InspectCarsCondition['data']['cars_use'], PropsViewInspectCarsConditionWithForm> = {
  properties: {
    waybill_issue_log_exists: {
      validateIf: {
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'valueOfArray',
      title: 'Журнал выдачи путевых листов',
      required: true,
    },
    waybill_issue_log_used: {
      validateIf: {
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'valueOfArray',
      title: 'Журнал выдачи путевых листов',
      required: true,
    },
    comment: {
      validateIf: {
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'string',
      title: 'Комментарий',
      maxLength: 4000,
    },
    comment_detected: {
      validateIf: {
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
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'number',
      title: 'Водителей',
    },
    staff_mechanics: {
      validateIf: {
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'number',
      title: 'Механизаторов',
    },
    list_drivers: {
      validateIf: {
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'number',
      title: 'Водителей',
    },
    list_mechanics: {
      validateIf: {
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'number',
      title: 'Механизаторов',
    },
    staffing_drivers: {
      validateIf: {
        path: 'checks_period_text',
        reverse: true,
      },
      type: 'number',
      title: 'Водителей',
    },
    staffing_mechanics: {
      validateIf: {
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
  },
  dependencies: {
    checked_cars_cnt: [
      (checked_cars_cnt, { cars_cnt }, props) => {
        if (props.type === INSPECT_AUTOBASE_TYPE_FORM.close) {
          if (checked_cars_cnt !== cars_cnt) {
            return 'error';
          }
        }
      },
    ],
    resolve_to: [
      (resolve_to, _, props) => {
        if (props.type === INSPECT_AUTOBASE_TYPE_FORM.close && !resolve_to) {
          return 'Поле "Срок, до которого необходимо представить отчет об устранении выявленных недостатков" необходимо заполнить';
        }
      },
    ],
  },
};
