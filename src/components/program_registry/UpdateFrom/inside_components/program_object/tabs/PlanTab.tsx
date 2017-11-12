import * as React from 'react';
import { Col } from 'react-bootstrap';

import { ExtField } from 'components/ui/Field.jsx';

class PlanTab extends React.Component<any, any> {
  render() {
    const {
      isPermitted,
      state: {
        plan_date_start,
        plan_date_end,
        note,
      },
      errors,
    } = this.props;

    return (
      <div>
        <Col md={12}>
          <label>Плановые даты проведения ремонта</label>
        </Col>
        <Col md={12}>
          <div style={{ display: 'flex' }}>
            <div>
              <ExtField
                type={'date'}
                date={plan_date_start}
                time={false}
                error={errors.plan_date_start}
                onChange={this.props.handleChange}
                boundKeys={['plan_date_start']}
                disabled={!isPermitted}
              />
            </div>
            <div style={{
              width: 40,
              textAlign: 'center',
              marginTop: 5,
            }}>—</div>
            <div>
              <ExtField
                type={'date'}
                date={plan_date_end}
                time={false}
                error={errors.plan_date_end}
                onChange={this.props.handleChange}
                boundKeys={['plan_date_end']}
                disabled={false}
              />
            </div>
          </div>
        </Col>
        <Col md={12}>
          <ExtField
            type="string"
            value={note}
            label={"Примечание"}
            error={errors.name}
            onChange={this.props.handleChange}
            boundKeys={['note']}
            disabled={false}
          />
        </Col>
      </div>
    );
  }
}

export default PlanTab;
