import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { Glyphicon, Button } from 'react-bootstrap';
import { DivNone } from 'global-styled/global-styled';
import { CommissionMembersDataContainer } from './styled';
import { createValidDate } from 'utils/dates';

type ViewCommissionEmployeeProps = (
  (
    {
      canRemove?: boolean;
      index?: number;
      handleRemove?: (index: number) => any;
    }
  ) & (
    Pick<ValuesOf<InspectCarsCondition['commission_members']>, 'assignment' | 'assignment_date_start' | 'fio' | 'position'>
  )
);

const ViewCommissionEmployee: React.FC<ViewCommissionEmployeeProps> = React.memo(
  (props) => {
    let text = '';
    if (props.position) {
      text = `${props.position}`;
    }

    if (props.assignment && props.assignment_date_start) {
      text = `${text}, действующий по доверенности: от ${createValidDate(props.assignment_date_start)} № ${props.assignment}`;
    }

    if (props.fio) {
      text = `${text} ${props.fio}`;
    }

    const handleClick = React.useCallback(
      () => {
        props.handleRemove(props.index);
      },
      [props.index, props.handleRemove],
    );

    return (
      <CommissionMembersDataContainer>
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
      </CommissionMembersDataContainer>
    );
  },
);

export default ViewCommissionEmployee;
