import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { Row, Col, Button } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { employeeEmployeeGetSetEmployee } from 'redux-main/reducers/modules/employee/employee/actions';
import useEmployeeOptions from './useEmployeeOptions';
import { ReduxState } from 'redux-main/@types/state';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { DivNone } from 'global-styled/global-styled';

type RowAddCommissionMembersDispatchProps = {
  employeeEmployeeGetSetEmployee: HandleThunkActionCreator<typeof employeeEmployeeGetSetEmployee>;
};

type RowAddCommissionMembersOwnProps = {
  isPermitted: boolean;
  handleAddChangeCommissionMembers: (commission_members: ValuesOf<InspectCarsCondition['commission_members']>) => any;
  commission_members: InspectCarsCondition['commission_members'];

  page: string;
  path?: string;
};

type RowAddCommissionMembersMergedProps = (
  RowAddCommissionMembersDispatchProps
  & RowAddCommissionMembersOwnProps
);

type RowAddCommissionMembersProps = RowAddCommissionMembersMergedProps;

const RowAddCommissionMembers: React.FC<RowAddCommissionMembersProps> = React.memo(
  (props) => {
    const [selectedEmployee, setSelectedEmployee] = React.useState<DefaultSelectOption<Employee['id'], Employee['full_name'], Employee>>(null);

    const handleClickAddCommissionEmployee = React.useCallback(
      () => {
        props.handleAddChangeCommissionMembers({
          employee_id: selectedEmployee.rowData.id,
          fio: selectedEmployee.rowData.full_name,
          assignment: selectedEmployee.rowData.assignment,
          assignment_date_start: selectedEmployee.rowData.assignment_date_start,
          position: selectedEmployee.rowData.position_name,
        });
        setSelectedEmployee(null);
      },
      [selectedEmployee],
    );

    const options = useEmployeeOptions(
      props.employeeEmployeeGetSetEmployee,
      props.page,
    );

    const filterOption = React.useCallback(
      (option) => {
        return !props.commission_members.find(({ employee_id }) => option.value === employee_id);
      },
      [props.commission_members],
    );

    return (
      props.isPermitted
        ? (
          <Row>
            <Col md={6}>
              <ExtField
                type="select"
                value={selectedEmployee}
                label={false}
                error=""
                options={options}
                onChange={setSelectedEmployee}
                legacy={false}
                filterOption={filterOption}
              />
            </Col>
            <Col md={6}>
              <Button block disabled={!selectedEmployee} onClick={handleClickAddCommissionEmployee}>Добавить представителя ГБУ</Button>
            </Col>
          </Row>
        )
        : (
          <DivNone />
        )
    );
  },
);

export default connect<{}, RowAddCommissionMembersDispatchProps, RowAddCommissionMembersOwnProps, ReduxState>(
  null,
  (dispatch: any) => ({
    employeeEmployeeGetSetEmployee: (...arg) => (
      dispatch(
        employeeEmployeeGetSetEmployee(...arg),
      )
    ),
  }),
)(RowAddCommissionMembers);
