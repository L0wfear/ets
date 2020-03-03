import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useInspectAuditorsOptions from 'components/new/utils/hooks/services/useOptions/useInspectAuditorsOptions';
import { RowAddCommissionMembersWrapper } from './styled';
import { AgentsFromGbuMemberDataContainer, AgentsFromGbuCloseBtn } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/agents_from_gbu/styled';
import { FooterEnd } from 'global-styled/global-styled';

type RowAddCommissionMembersProps = {
  handleAddChangeCommissionMembers: (commission_members: ValuesOf<InspectCarsCondition['commission_members']>) => any;
  commission_members: InspectCarsCondition['commission_members'];
  company_id: InspectCarsCondition['company_id'];
  handleCloseCommissionMembers: any;
  showCloseBtn: boolean;

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
        props.handleCloseCommissionMembers();
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
          );
        },
      ),
      [optionData.options, props.commission_members],
    );

    return (
      <RowAddCommissionMembersWrapper>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <AgentsFromGbuMemberDataContainer>
              {
                props.showCloseBtn && (
                  <FooterEnd>
                    <AgentsFromGbuCloseBtn onClick={props.handleCloseCommissionMembers}>
                      <EtsBootstrap.Glyphicon glyph="remove"/>
                    </AgentsFromGbuCloseBtn>
                  </FooterEnd>
                )
              }
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
              <EtsBootstrap.Button
                block
                disabled={!selectedEmployee}
                onClick={handleClickAddCommissionEmployee}
              >
                {'Сохранить'}
              </EtsBootstrap.Button>
            </AgentsFromGbuMemberDataContainer>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </RowAddCommissionMembersWrapper>
    );
  },
);

export default RowAddCommissionMembers;
