import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { Glyphicon, Button } from 'react-bootstrap';
import { DivNone } from 'global-styled/global-styled';
import { AgentsFromGbuDataContainer } from './styled';

type ViewAgentFromGbuEmployeeProps = (
  (
    {
      canRemove: boolean;
      index: number;
      handleRemove: (index: number) => any;
      company_name: InspectCarsCondition['company_name'];
    }
  ) & (
    ValuesOf<InspectCarsCondition['agents_from_gbu']>
  )
);

const ViewAgentFromGbuEmployee: React.FC<ViewAgentFromGbuEmployeeProps> = React.memo(
  (props) => {
    const text = ` От ${props.company_name} ${props.position} ${props.fio}`;

    const handleClick = React.useCallback(
      () => {
        props.handleRemove(props.index);
      },
      [props.index, props.handleRemove],
    );

    return (
      <AgentsFromGbuDataContainer>
        <div>
          <Glyphicon glyph="minus" /> {text}
        </div>
        <div>
          {
            props.canRemove
              ? (
                <Button onClick={handleClick}>
                  <Glyphicon glyph="remove" />
                </Button>
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
