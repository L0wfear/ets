import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useInspectAuditorsOptions from 'components/new/utils/hooks/services/useOptions/useInspectAuditorsOptions';
import { RowAddCommissionMembersWrapper } from './styled';

type RowAddCommissionMembersProps = {
  handleAddChangeCommissionMembers: (commission_members: ValuesOf<InspectCarsCondition['commission_members']>) => any;
  commission_members: InspectCarsCondition['commission_members'];
  company_id: InspectCarsCondition['company_id']

  page: string;
  path?: string;
};

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

    const optionData = useInspectAuditorsOptions();

    const filterOptions = React.useMemo(
      () => optionData.options.filter(
        (option) => {
          return (
            !props.commission_members.find(
              ({ employee_id }) => option.value === employee_id,
            )
            && option.rowData.active
          );
        },
      ),
      [optionData.options, props.commission_members],
    );

    return (
      <RowAddCommissionMembersWrapper>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="select"
              value={selectedEmployee}
              label={false}
              error=""
              options={filterOptions}
              onChange={setSelectedEmployee}
              legacy={false}
              etsIsLoading={optionData.isLoading}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <EtsBootstrap.Button
              block
              disabled={!selectedEmployee}
              onClick={handleClickAddCommissionEmployee}
            >
              <EtsBootstrap.Glyphicon glyph="plus" /> {'Добавить проверяющего'}
            </EtsBootstrap.Button>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </RowAddCommissionMembersWrapper>
    );
  },
);

export default RowAddCommissionMembers;
