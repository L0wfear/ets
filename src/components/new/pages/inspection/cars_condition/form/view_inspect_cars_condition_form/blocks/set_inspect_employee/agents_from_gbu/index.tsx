import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { ViewInspectCarsConditionProps } from '../../../@types/ViewInspectCarsContidion';
import ViewAgentFromGbuEmployee from './ViewAgentFromGbuEmployee';
import RowAddRowAddAgentFromGbu from './RowAddAgentFromGbu';

type AgentsFromGbuProps = {
  isPermittedToChange: boolean;

  agents_from_gbu: InspectCarsCondition['agents_from_gbu'];
  company_name: InspectCarsCondition['company_name'];
  handleChange: ViewInspectCarsConditionProps['handleChange'];
};

const AgentsFromGbu: React.FC<AgentsFromGbuProps> = React.memo(
  (props) => {
    const handleRemoveAgent = React.useCallback(
      (index) => {
        props.handleChange({
          agents_from_gbu: props.agents_from_gbu.filter((_, indexRow) => index !== indexRow),
        });
      },
      [props.agents_from_gbu, props.handleChange],
    );

    const handleAddChangeRowAddAgentFromGbu = React.useCallback(
      (agent_from_gbu: ValuesOf<AgentsFromGbuProps['agents_from_gbu']>) => {
        props.handleChange({
          agents_from_gbu: [
            ...props.agents_from_gbu,
            agent_from_gbu,
          ],
        });
      },
      [props.agents_from_gbu, props.handleChange],
    );

    return (
      <React.Fragment>
        <h5>Проверяющие:</h5>
        <div>
          {
            props.agents_from_gbu.map((agent, index) => (
              <ViewAgentFromGbuEmployee
                key={index + 1}
                canRemove={props.isPermittedToChange}
                index={index}
                handleRemove={handleRemoveAgent}
                company_name={props.company_name}

                fio={agent.fio}
                position={agent.position}
              />
            ))
          }
          <br />
          <RowAddRowAddAgentFromGbu
            isPermitted={props.isPermittedToChange}
            handleAddChangeRowAddAgentFromGbu={handleAddChangeRowAddAgentFromGbu}
          />
        </div>
      </React.Fragment>
    );
  },
);

export default AgentsFromGbu;
