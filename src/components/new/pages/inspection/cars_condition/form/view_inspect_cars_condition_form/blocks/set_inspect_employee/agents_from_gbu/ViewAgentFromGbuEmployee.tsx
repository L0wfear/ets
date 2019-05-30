import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { DivNone } from 'global-styled/global-styled';
import { AgentsFromGbuDataContainer } from './styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
      <AgentsFromGbuDataContainer>
        <div>
          <EtsBootstrap.Glyphicon glyph="minus" /> {text}
        </div>
        <div>
          {
            props.canRemove
              ? (
                <EtsBootstrap.Button onClick={handleClick}>
                  <EtsBootstrap.Glyphicon glyph="remove" />
                </EtsBootstrap.Button>
              )
              : (
                <DivNone />
              )
          }
        </div>
      </AgentsFromGbuDataContainer>
    );
  },
);

export default ViewAgentFromGbuEmployee;
