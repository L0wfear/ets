import { SchemaType } from "components/ui/form/new/@types/validate.h";
import { ViewAddInspectEmployeeInitialState } from "components/new/pages/inspection/common_components/add_inspect_employee/addInspectEmployee";

export const addInspectEmployeeSchema: SchemaType<Partial<ViewAddInspectEmployeeInitialState>, any> = {
  properties: {
    resolve_to: {
      title: 'Срок, до которого необходимо устранить недостатки',
      type: 'date',
    },
    member_fio: {
      title: 'ФИО',
      type: 'string',
      required: true,
    },
    member_position: {
      title: 'Должность',
      type: 'string',
      required: true,
    },
    agent_from_gbu_fio: {
      title: 'ФИО',
      type: 'string',
      required: true,
    },
    agent_from_gbu_position: {
      title: 'Должность',
      type: 'string',
      required: true,
    },
  },
};
