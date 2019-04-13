import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { ExtField } from 'components/ui/new/field/ExtField';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { get } from 'lodash';
import { Row, Col } from 'react-bootstrap';

type BlockCarsConditionHeadCountListProps = {
  onChange: any;
  headcount_list: InspectCarsCondition['headcount_list'];
  disabled?: boolean;
};

const BlockCarsConditionHeadCountList: React.FC<BlockCarsConditionHeadCountListProps> = React.memo(
  (props) => {
    const {
      headcount_list: state,
    } = props;

    const handleChange = React.useCallback(
      (key, event) => {
        props.onChange({
          headcount_list: {
            ...props.headcount_list,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [props.onChange, props.headcount_list],
    );

    return (
      <BoxContainer>
        <h4>Штатная и списочная численность</h4>
        <Row>
          <Col md={12}>
            <h5>По штатному расписанию.</h5>
          </Col>
          <Col md={6}>
            <ExtField
              id="staff_drivers"
              type="number"
              label="Водителей:"
              value={state.staff_drivers}
              onChange={handleChange}
              boundKeys="staff_drivers"
              disabled={props.disabled}
            />
          </Col>
          <Col md={6}>
            <ExtField
              id="staff_mechanics"
              type="number"
              label="Механизаторов:"
              value={state.staff_mechanics}
              onChange={handleChange}
              boundKeys="staff_mechanics"
              disabled={props.disabled}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h5>Списочное количество.</h5>
          </Col>
          <Col md={6}>
            <ExtField
              id="list_drivers"
              type="number"
              label="Водителей:"
              value={state.list_drivers}
              onChange={handleChange}
              boundKeys="list_drivers"
              disabled={props.disabled}
            />
          </Col>
          <Col md={6}>
            <ExtField
              id="list_mechanics"
              type="number"
              label="Механизаторов:"
              value={state.list_mechanics}
              onChange={handleChange}
              boundKeys="list_mechanics"
              disabled={props.disabled}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h5>Укомплектованность.</h5>
          </Col>
          <Col md={6}>
            <ExtField
              id="staffing_drivers"
              type="number"
              label="Водителей:"
              value={state.staffing_drivers}
              onChange={handleChange}
              boundKeys="staffing_drivers"
              disabled={props.disabled}
            />
          </Col>
          <Col md={6}>
            <ExtField
              id="staffing_mechanics"
              type="number"
              label="Механизаторов:"
              value={state.staffing_mechanics}
              onChange={handleChange}
              boundKeys="staffing_mechanics"
              disabled={props.disabled}
            />
          </Col>
        </Row>
      </BoxContainer>
    );
  },
);

export default BlockCarsConditionHeadCountList;
