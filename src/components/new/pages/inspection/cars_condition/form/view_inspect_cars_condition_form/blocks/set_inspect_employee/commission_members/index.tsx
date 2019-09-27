import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { ViewInspectCarsConditionProps } from '../../../@types/ViewInspectCarsContidion';
import ViewCommissionEmployee from './ViewCommissionEmployee';
import RowAddCommissionMembers from './RowAddCommissionMembers';
import { ViewInspectAutobaseProps } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/@types/ViewInspectAutobase';
import { ViewInspectPgmBaseProps } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/@types/ViewInspectPgmBase';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { CommissionEmployeeWrapper, CommissionMembersDataContainer, CommissionMembersAddBtn } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/commission_members/styled';
import { SlimH4, HrDelimiter } from 'global-styled/global-styled';

type CommissionMembersProps = {
  isPermittedChangeListParams: boolean;
  commission_members: InspectCarsCondition['commission_members'];
  error: string;

  company_id: InspectCarsCondition['company_id'];
  handleChange: (
    ViewInspectCarsConditionProps['handleChange']
    | ViewInspectAutobaseProps['handleChange']
    | ViewInspectPgmBaseProps['handleChange']
  );

  page: string;
  path?: string;
};

const CommissionMembers: React.FC<CommissionMembersProps> = React.memo(
  (props) => {
    const [showCommissionMembers, setShowCommissionMembers] = React.useState(false);
    const [showCloseBtn, setShowCloseBtn] = React.useState(false);

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
    const handleShowCommissionMembers = React.useCallback( () => {
      setShowCommissionMembers(true);
    },
    [props.commission_members],
  );

    const handleCloseCommissionMembers = React.useCallback( () => {
        setShowCommissionMembers(false);
      },
      [props.commission_members],
    );

    React.useEffect(() => {
      if (!props.commission_members.length) { // Если нет сотркдников ГБУ, то отображаем блок
        setShowCommissionMembers(true);
        setShowCloseBtn(false);
      } else {
        setShowCloseBtn(true);
      }
    }, [props.commission_members]);

    return (
      <CommissionEmployeeWrapper>
        <HrDelimiter />
        <h3>Подписанты</h3>
        <div>
          <SlimH4>Проверяющие от Доринвеста</SlimH4>
          {
            Boolean(props.error) && (
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={12}>
                  <ErrorsBlock
                    error={props.error}
                  />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            )
          }
          <CommissionMembersDataContainer>
            {
              props.commission_members.map((commissionEmployee, index) => (
                <ViewCommissionEmployee
                  key={commissionEmployee.employee_id}
                  canRemove={props.isPermittedChangeListParams}
                  index={index}
                  handleRemove={handleRemove}

                  fio={commissionEmployee.fio}
                  assignment={commissionEmployee.assignment}
                  assignment_date_start={commissionEmployee.assignment_date_start}
                  position={commissionEmployee.position}
                />
              ))
            }
          </CommissionMembersDataContainer>
          <CommissionMembersAddBtn
            disabled={showCommissionMembers}
            onClick={handleShowCommissionMembers}
          >
            <EtsBootstrap.Glyphicon glyph='plus' />
            Добавить проверяющего
          </CommissionMembersAddBtn>
          {
            props.isPermittedChangeListParams && showCommissionMembers && (
              <RowAddCommissionMembers
                handleAddChangeCommissionMembers={handleAddChangeCommissionMembers}
                commission_members={props.commission_members}
                company_id={props.company_id}
                handleCloseCommissionMembers={handleCloseCommissionMembers}
                showCloseBtn={showCloseBtn}

                page={props.page}
                path={props.path}
              />
            )
          }
        </div>
      </CommissionEmployeeWrapper>
    );
  },
);

export default CommissionMembers;
