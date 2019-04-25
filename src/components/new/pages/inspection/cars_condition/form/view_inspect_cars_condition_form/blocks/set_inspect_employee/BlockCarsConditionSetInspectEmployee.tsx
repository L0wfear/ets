import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { ViewInspectCarsConditionProps } from '../../@types/ViewInspectCarsContidion';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import { BlockEmployeeContainer } from './styled';
import CommissionMembers from './commission_members';
import AgentsFromGbu from './agents_from_gbu';
import { ExtField } from 'components/ui/new/field/ExtField';

type BlockCarsConditionSetInspectEmployeeProps = {
  type: keyof typeof INSPECT_AUTOBASE_TYPE_FORM;
  isPermitted: boolean;

  close_employee_assignment: InspectCarsCondition['close_employee_assignment'];
  close_employee_assignment_date_start: InspectCarsCondition['close_employee_assignment_date_start'];
  close_employee_fio: InspectCarsCondition['close_employee_fio'];
  close_employee_position: InspectCarsCondition['close_employee_position'];
  commission_members: InspectCarsCondition['commission_members'];

  agents_from_gbu: InspectCarsCondition['agents_from_gbu'];
  company_name: InspectCarsCondition['company_name'];

  handleChange: ViewInspectCarsConditionProps['handleChange'];

  resolve_to: InspectCarsCondition['resolve_to'];
  error_resolve_to: string;

  page: string;
  path?: string;
};

const BlockCarsConditionSetInspectEmployee: React.FC<BlockCarsConditionSetInspectEmployeeProps> = React.memo(
  (props) => {
    const isPermittedToChange = props.isPermitted && props.type === INSPECT_AUTOBASE_TYPE_FORM.close;

    return props.type !== INSPECT_AUTOBASE_TYPE_FORM.list && (
      <BlockEmployeeContainer>
        <ExtField
          type="date"
          label="Срок, до которого необходимо представить отчет об устранении выявленных недостатков"
          value={props.resolve_to}
          time={false}
          error={props.error_resolve_to}
          disabled={!isPermittedToChange}
          onChange={props.handleChange}
          boundKeys="resolve_to"
          makeGoodFormat
        />
        <CommissionMembers
          close_employee_fio={props.close_employee_fio}
          close_employee_position={props.close_employee_position}
          close_employee_assignment={props.close_employee_assignment}
          close_employee_assignment_date_start={props.close_employee_assignment_date_start}
          isPermittedToChange={isPermittedToChange}

          commission_members={props.commission_members}
          handleChange={props.handleChange}
          page={props.page}
          path={props.path}
        />
        <br />
        <AgentsFromGbu
          isPermittedToChange={isPermittedToChange}
          agents_from_gbu={props.agents_from_gbu}
          company_name={props.company_name}
          handleChange={props.handleChange}
        />
      </BlockEmployeeContainer>
    );
  },
);

export default BlockCarsConditionSetInspectEmployee;
