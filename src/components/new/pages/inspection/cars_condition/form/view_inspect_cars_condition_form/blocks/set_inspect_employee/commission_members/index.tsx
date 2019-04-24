import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { ViewInspectCarsConditionProps } from '../../../@types/ViewInspectCarsContidion';
import ViewCommissionEmployee from './ViewCommissionEmployee';
import RowAddCommissionMembers from './RowAddCommissionMembers';

type CommissionMembersProps = {
  close_employee_assignment: InspectCarsCondition['close_employee_assignment'];
  close_employee_assignment_date_start: InspectCarsCondition['close_employee_assignment_date_start'];
  close_employee_fio: InspectCarsCondition['close_employee_fio'];
  close_employee_position: InspectCarsCondition['close_employee_position'];

  isPermittedToChange: boolean;
  commission_members: InspectCarsCondition['commission_members'];
  handleChange: ViewInspectCarsConditionProps['handleChange'];

  page: string;
  path?: string;
};

const CommissionMembers: React.FC<CommissionMembersProps> = React.memo(
  (props) => {
    const handleRemove = React.useCallback(
      (index) => {
        props.handleChange({
          commission_members: props.commission_members.filter((_, indexRow) => index !== indexRow),
        });
      },
      [props.commission_members, props.handleChange],
    );

    const handleAddChangeCommissionMembers = React.useCallback(
      (commission_member: ValuesOf<CommissionMembersProps['commission_members']>) => {
        props.handleChange({
          commission_members: [
            ...props.commission_members,
            commission_member,
          ],
        });
      },
      [props.commission_members, props.handleChange],
    );

    return (
      <React.Fragment>
        <h4>Осмотр техники производили:</h4>
        <div>
          <h5>От ГБУ "Доринвест":</h5>
          <div>
            <ViewCommissionEmployee
              fio={props.close_employee_fio}
              assignment={props.close_employee_assignment}
              assignment_date_start={props.close_employee_assignment_date_start}
              position={props.close_employee_position}
            />
            {
              props.commission_members.map((commissionEmployee, index) => (
                <ViewCommissionEmployee
                  key={commissionEmployee.employee_id}
                  canRemove={props.isPermittedToChange}
                  index={index}
                  handleRemove={handleRemove}

                  fio={commissionEmployee.fio}
                  assignment={commissionEmployee.assignment}
                  assignment_date_start={commissionEmployee.assignment_date_start}
                  position={commissionEmployee.position}
                />
              ))
            }
            <br />
            <RowAddCommissionMembers
              isPermitted={props.isPermittedToChange}
              handleAddChangeCommissionMembers={handleAddChangeCommissionMembers}
              commission_members={props.commission_members}

              page={props.page}
              path={props.path}
            />
          </div>
        </div>
      </React.Fragment>
    );
  },
);

export default CommissionMembers;
