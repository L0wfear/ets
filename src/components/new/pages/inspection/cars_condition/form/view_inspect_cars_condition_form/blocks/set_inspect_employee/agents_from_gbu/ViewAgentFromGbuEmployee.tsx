import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { DivNone } from 'global-styled/global-styled';
import { CommissionAgentsMembersItem, CommissionAgentsMembersText, CommissionAgentsMembersRemoveButton } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/commission_members/styled';

type ViewAgentFromGbuEmployeeProps = (
  (
    {
      canRemove: boolean;
      index: number;
      handleRemove: (index: number) => any;
      company_short_name: InspectCarsCondition['company_short_name'];
    }
  ) & (
    ValuesOf<InspectCarsCondition['agents_from_gbu']>
  )
);

const ViewAgentFromGbuEmployee: React.FC<ViewAgentFromGbuEmployeeProps> = React.memo(
  (props) => {
    const text = ` От ${props.company_short_name} ${props.position} ${props.fio}`;

    const handleClick = React.useCallback(
      () => {
        props.handleRemove(props.index);
      },
      [props.index, props.handleRemove],
    );

    return (
      <CommissionAgentsMembersItem>
        {
          props.canRemove
            ? (
              <CommissionAgentsMembersRemoveButton onClick={handleClick}>
                ×
              </CommissionAgentsMembersRemoveButton>
            )
            : (
              <DivNone />
            )
        }
        <CommissionAgentsMembersText>
          {text}
        </CommissionAgentsMembersText>
      </CommissionAgentsMembersItem>
    );
  },
);

export default ViewAgentFromGbuEmployee;
