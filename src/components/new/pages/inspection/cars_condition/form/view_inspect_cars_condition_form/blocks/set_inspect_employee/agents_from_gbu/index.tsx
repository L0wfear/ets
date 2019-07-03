import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { ViewInspectCarsConditionProps } from '../../../@types/ViewInspectCarsContidion';
import ViewAgentFromGbuEmployee from './ViewAgentFromGbuEmployee';
import RowAddRowAddAgentFromGbu from './RowAddAgentFromGbu';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ViewInspectAutobaseProps } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/@types/ViewInspectAutobase';
import { ViewInspectPgmBaseProps } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/@types/ViewInspectPgmBase';
import { AgentsFromGbuWrapper } from './styled';

type AgentsFromGbuProps = {
  isPermittedToChange: boolean;

  agents_from_gbu: InspectCarsCondition['agents_from_gbu'];
  error: string;
  company_short_name: InspectCarsCondition['company_short_name'];
  handleChange: (
    ViewInspectCarsConditionProps['handleChange']
    | ViewInspectAutobaseProps['handleChange']
    | ViewInspectPgmBaseProps['handleChange']
  );
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
      <AgentsFromGbuWrapper>
        <h5>Представители ГБУ:</h5>
        {
          Boolean(props.error) && (
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}><div className="error">{props.error}</div></EtsBootstrap.Col>
            </EtsBootstrap.Row>
          )
        }
        <div>
          {
            props.agents_from_gbu.map((agent, index) => (
              <ViewAgentFromGbuEmployee
                key={index + 1}
                canRemove={props.isPermittedToChange}
                index={index}
                handleRemove={handleRemoveAgent}
                company_short_name={props.company_short_name}

                fio={agent.fio}
                position={agent.position}
              />
            ))
          }
          <RowAddRowAddAgentFromGbu
            isPermitted={props.isPermittedToChange}
            handleAddChangeRowAddAgentFromGbu={handleAddChangeRowAddAgentFromGbu}
          />
        </div>
      </AgentsFromGbuWrapper>
    );
  },
);

export default AgentsFromGbu;
