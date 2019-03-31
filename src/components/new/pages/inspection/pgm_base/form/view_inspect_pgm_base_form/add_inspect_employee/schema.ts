import { SchemaType } from "components/ui/form/new/@types/validate.h";
import { ViewAddInspectEmployeeInitialState } from "components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/add_inspect_employee/addInspectEmployee";

export const addInspectEmployeeSchema: SchemaType<Partial<ViewAddInspectEmployeeInitialState>, any> = {
  properties: [
    {
      key: 'resolve_to',
      title: 'Срок, до которого необходимо устранить недостатки',
      type: 'date',
      required: true,
    },
    {
      key: 'member_fio',
      title: 'ФИО',
      type: 'string',
      required: true,
    },
    {
      key: 'member_position',
      title: 'Должность',
      type: 'string',
      required: true,
    },
    {
      key: 'agent_from_gbu_fio',
      title: 'ФИО',
      type: 'string',
      required: true,
    },
    {
      key: 'agent_from_gbu_position',
      title: 'Должность',
      type: 'string',
      required: true,
    },
  ],
};
